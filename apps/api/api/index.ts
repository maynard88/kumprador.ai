import 'reflect-metadata';
import 'dotenv/config';
import { Server } from '../src/presentation/server';

let serverInstance: Server | null = null;
let isInitialized = false;

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    // Initialize server only once
    if (!isInitialized) {
      serverInstance = new Server();
      
      // Initialize MongoDB connection
      const container = (serverInstance as any).container;
      const mongoConnection = container.get('mongoConnection');
      await mongoConnection.connect();
      console.log('✅ MongoDB connected successfully');
      
      // Start Apollo Server
      const apolloServer = (serverInstance as any).apolloServer;
      await apolloServer.start();
      apolloServer.applyMiddleware({ 
        app: serverInstance.getApp(), 
        path: '/api/graphql' 
      });
      
      isInitialized = true;
      console.log('🚀 Server initialized for Vercel');
    }
    
    // Handle the request with Express app
    return serverInstance!.getApp()(req, res);
  } catch (error) {
    console.error('❌ Error in Vercel handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
