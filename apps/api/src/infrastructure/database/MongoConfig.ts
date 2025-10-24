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
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    w: 'majority' as const,
  },
};
