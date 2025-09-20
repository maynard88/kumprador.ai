import 'reflect-metadata';
import 'dotenv/config';
import { Server } from './presentation/server';

const port = parseInt(process.env.PORT || '4000', 10);

const server = new Server();
server.start(port).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
