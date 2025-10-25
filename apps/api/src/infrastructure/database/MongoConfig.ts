import { MongoClientOptions } from 'mongodb';

export interface MongoConfig {
  connectionString: string;
  databaseName: string;
  options?: MongoClientOptions;
}

export const defaultMongoConfig: MongoConfig = {
  connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  databaseName: process.env.MONGODB_DATABASE || 'bantay_presyo',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // Only use TLS for production deployments (Vercel) with MongoDB Atlas
    tls: process.env.NODE_ENV === 'production' && process.env.MONGODB_URI?.includes('mongodb.net'),
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    w: 'majority' as const,
  },
};
