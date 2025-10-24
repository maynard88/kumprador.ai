import 'reflect-metadata';
import 'dotenv/config';
import { Server } from '../src/presentation/server';

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  const server = new Server();
  const app = server.getApp();
  
  // Handle the request with Express app
  return app(req, res);
}
