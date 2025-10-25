import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Container } from '../infrastructure/container/Container';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { PriceDataCache } from '../infrastructure/cache/PriceDataCache';
import { graphqlRateLimiter, apiRateLimiter } from '../middleware/rateLimiter';
import { securityHeaders, corsOptions } from '../middleware/securityHeaders';
import { errorHandler, notFoundHandler, handleUncaughtException, handleUnhandledRejection } from '../middleware/errorHandler';

export class Server {
  private app: express.Application;
  private apolloServer: ApolloServer;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = Container.getInstance();
    
    // Setup error handlers first
    handleUncaughtException();
    handleUnhandledRejection();
    
    this.setupMiddleware();
    this.setupApolloServer();
  }

  private setupMiddleware(): void {
    // Security headers (must be first)
    this.app.use(securityHeaders);
    
    // Helmet for additional security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.openai.com", "https://www.bantaypresyo.da.gov.ph"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      }
    }));
    
    // CORS with security
    this.app.use(cors(corsOptions));
    
    // Body parsing with size limits
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    
    // Rate limiting
    this.app.use('/api/', apiRateLimiter);
    this.app.use('/api/graphql', graphqlRateLimiter);
    
    // Add cache stats endpoint for monitoring (before auth)
    this.app.get('/api/cache/stats', (req, res) => {
      const cache = PriceDataCache.getInstance();
      const stats = cache.getCacheStats();
      res.json({
        cache: stats,
        timestamp: new Date().toISOString()
      });
    });
    
    // Apply API key authentication to all routes except GraphQL and cache stats
    this.app.use((req, res, next) => {
      // Skip API key auth for GraphQL endpoint and cache stats
      if (req.path === '/api/graphql' || req.path === '/api/cache/stats') {
        return next();
      }
      return apiKeyAuth(req, res, next);
    });
  }

  private setupApolloServer(): void {
    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        getPriceDataUseCase: this.container.get('getPriceDataUseCase'),
        processConversationUseCase: this.container.get('processConversationUseCase'),
        isAuthenticated: (req as any).isAuthenticated || false,
        req: req as any,
      }),
      introspection: process.env.NODE_ENV !== 'production',
      cache: 'bounded',
      persistedQueries: false,
    });
  }

  public async start(port: number = 4000): Promise<void> {
    try {
      // Initialize MongoDB connection
      const mongoConnection = this.container.get<any>('mongoConnection');
      await mongoConnection.connect();
      console.log('✅ MongoDB connected successfully');

      // Setup cache cleanup interval (every 10 minutes)
      const cache = PriceDataCache.getInstance();
      setInterval(() => {
        cache.clearExpired();
        console.log('🧹 Cache cleanup completed');
      }, 10 * 60 * 1000); // 10 minutes

      await this.apolloServer.start();
      this.apolloServer.applyMiddleware({ app: this.app as any, path: '/api/graphql' });

      // Add 404 and error handlers after Apollo Server middleware
      this.app.use(notFoundHandler);
      this.app.use(errorHandler);

      this.app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}${this.apolloServer.graphqlPath}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}
