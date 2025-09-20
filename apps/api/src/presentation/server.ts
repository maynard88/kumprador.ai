import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Container } from '../infrastructure/container/Container';

export class Server {
  private app: express.Application;
  private apolloServer: ApolloServer;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = Container.getInstance();
    this.setupMiddleware();
    this.setupApolloServer();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupApolloServer(): void {
    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        getPriceDataUseCase: this.container.get('getPriceDataUseCase'),
      }),
      introspection: process.env.NODE_ENV !== 'production',
    });
  }

  public async start(port: number = 4000): Promise<void> {
    try {
      // Initialize MongoDB connection
      const mongoConnection = this.container.get('mongoConnection');
      await mongoConnection.connect();
      console.log('✅ MongoDB connected successfully');

      await this.apolloServer.start();
      this.apolloServer.applyMiddleware({ app: this.app as any, path: '/graphql' });

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
