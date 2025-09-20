import { MongoClient, Db } from 'mongodb';
import { MongoConfig } from './MongoConfig';

export interface IMongoConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getDatabase(): Db;
  isConnected(): boolean;
}

export class MongoConnection implements IMongoConnection {
  private client: MongoClient | null = null;
  private database: Db | null = null;
  private isConnectedFlag: boolean = false;

  constructor(private readonly config: MongoConfig) {}

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.config.connectionString, this.config.options);
      await this.client.connect();
      this.database = this.client.db(this.config.databaseName);
      this.isConnectedFlag = true;
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.database = null;
        this.isConnectedFlag = false;
        console.log('Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw new Error(`MongoDB disconnection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getDatabase(): Db {
    if (!this.database) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.database;
  }

  isConnected(): boolean {
    return this.isConnectedFlag && this.client !== null;
  }
}
