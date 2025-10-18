import { Collection } from 'mongodb';
import { IPriceDataRepository } from '../../domain/interfaces/IPriceDataRepository';
import { PriceData } from '../../domain/entities/PriceData';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { IMongoConnection } from '../database/MongoConnection';
import { PriceDataDocument, PriceDataDocumentMapper, MarketGroupedDataDocument } from '../database/models/PriceDataDocument';

export class MongoPriceDataRepository implements IPriceDataRepository {
  private readonly collectionName = 'price_data';
  private readonly marketGroupedCollectionName = 'market_grouped_data';

  constructor(private readonly mongoConnection: IMongoConnection) {}

  private getCollection(): Collection<PriceDataDocument> {
    return this.mongoConnection.getDatabase().collection<PriceDataDocument>(this.collectionName);
  }

  private getMarketGroupedCollection(): Collection<MarketGroupedDataDocument> {
    return this.mongoConnection.getDatabase().collection<MarketGroupedDataDocument>(this.marketGroupedCollectionName);
  }

  async save(priceData: PriceData, request: PriceRequest): Promise<void> {
    try {
      const document = PriceDataDocumentMapper.toDocument(priceData, request);
      const collection = this.getCollection();
      
      // Check if a record with the same commodity and region already exists
      const existingRecord = await collection.findOne({
        'request.commodity': request.commodity,
        'request.region': request.region,
      });

      if (existingRecord) {
        // Update existing record
        await collection.updateOne(
          { _id: existingRecord._id },
          { 
            $set: {
              ...document,
              _id: existingRecord._id,
              createdAt: existingRecord.createdAt,
              updatedAt: new Date(),
            }
          }
        );
      } else {
        // Insert new record
        await collection.insertOne(document as PriceDataDocument);
      }
    } catch (error) {
      throw new Error(`Failed to save price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveMarketGroupedData(marketGroupedData: any[], request: PriceRequest): Promise<void> {
    try {
      const collection = this.getMarketGroupedCollection();
      const currentDate = new Date();
      
      // Create document with current date and market grouped data
      const document: Omit<MarketGroupedDataDocument, '_id'> = {
        currentDate: currentDate,
        marketGroupedData: marketGroupedData,
        createdAt: currentDate,
        updatedAt: currentDate
      };

      // Check if a record already exists for today
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingRecord = await collection.findOne({
        currentDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

      if (existingRecord) {
        // Update existing record for today
        await collection.updateOne(
          { _id: existingRecord._id },
          { 
            $set: {
              ...document,
              _id: existingRecord._id,
              createdAt: existingRecord.createdAt,
              updatedAt: currentDate,
            }
          }
        );
        console.log(`Updated market grouped data for ${currentDate.toDateString()}`);
      } else {
        // Insert new record
        await collection.insertOne(document as MarketGroupedDataDocument);
        console.log(`Saved new market grouped data for ${currentDate.toDateString()}`);
      }
    } catch (error) {
      throw new Error(`Failed to save market grouped data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByCommodityAndRegion(commodity: string, region: string): Promise<PriceData[]> {
    try {
      const collection = this.getCollection();
      const documents = await collection
        .find({
          'request.commodity': commodity,
          'request.region': region,
        })
        .sort({ updatedAt: -1 })
        .toArray();

      return documents.map(doc => PriceDataDocumentMapper.toEntity(doc));
    } catch (error) {
      throw new Error(`Failed to find price data by commodity and region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByCommodity(commodity: string): Promise<PriceData[]> {
    try {
      const collection = this.getCollection();
      const documents = await collection
        .find({
          'request.commodity': commodity,
        })
        .sort({ updatedAt: -1 })
        .toArray();

      return documents.map(doc => PriceDataDocumentMapper.toEntity(doc));
    } catch (error) {
      throw new Error(`Failed to find price data by commodity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByRegion(region: string): Promise<PriceData[]> {
    try {
      const collection = this.getCollection();
      const documents = await collection
        .find({
          'request.region': region,
        })
        .sort({ updatedAt: -1 })
        .toArray();

      return documents.map(doc => PriceDataDocumentMapper.toEntity(doc));
    } catch (error) {
      throw new Error(`Failed to find price data by region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(): Promise<PriceData[]> {
    try {
      const collection = this.getCollection();
      const documents = await collection
        .find({})
        .sort({ updatedAt: -1 })
        .toArray();

      return documents.map(doc => PriceDataDocumentMapper.toEntity(doc));
    } catch (error) {
      throw new Error(`Failed to find all price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteByCommodityAndRegion(commodity: string, region: string): Promise<void> {
    try {
      const collection = this.getCollection();
      await collection.deleteMany({
        'request.commodity': commodity,
        'request.region': region,
      });
    } catch (error) {
      throw new Error(`Failed to delete price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTodayMarketGroupedData(): Promise<any[] | null> {
    try {
      const collection = this.getMarketGroupedCollection();
      const currentDate = new Date();
      
      // Check if a record already exists for today
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingRecord = await collection.findOne({
        currentDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

      return existingRecord ? existingRecord.marketGroupedData : null;
    } catch (error) {
      console.error('Error checking for existing data:', error);
      return null;
    }
  }
}
