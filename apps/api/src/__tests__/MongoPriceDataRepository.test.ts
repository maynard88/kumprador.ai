import { MongoPriceDataRepository } from '../infrastructure/repositories/MongoPriceDataRepository';
import { MongoConnection } from '../infrastructure/database/MongoConnection';
import { PriceData } from '../domain/entities/PriceData';
import { PriceRequest } from '../domain/value-objects/PriceRequest';
import { Commodity } from '../domain/entities/Commodity';
import { Market } from '../domain/entities/Market';

// Mock MongoDB connection
jest.mock('../infrastructure/database/MongoConnection');

describe('MongoPriceDataRepository', () => {
  let repository: MongoPriceDataRepository;
  let mockMongoConnection: jest.Mocked<MongoConnection>;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn(),
        }),
      }),
      deleteMany: jest.fn(),
    };

    mockMongoConnection = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getDatabase: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
      }),
      isConnected: jest.fn().mockReturnValue(true),
    } as any;

    repository = new MongoPriceDataRepository(mockMongoConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save new price data when no existing record', async () => {
      const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];
      const priceData = PriceData.create(commodity, markets);
      const request = new PriceRequest('Rice', 'Region VII', 10);

      mockCollection.findOne.mockResolvedValue(null);
      mockCollection.insertOne.mockResolvedValue({ insertedId: '123' });

      await repository.save(priceData, request);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        'request.commodity': 'Rice',
        'request.region': 'Region VII',
      });
      expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it('should update existing price data when record exists', async () => {
      const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];
      const priceData = PriceData.create(commodity, markets);
      const request = new PriceRequest('Rice', 'Region VII', 10);

      const existingRecord = {
        _id: '123',
        createdAt: new Date('2023-01-01'),
      };

      mockCollection.findOne.mockResolvedValue(existingRecord);
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await repository.save(priceData, request);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        'request.commodity': 'Rice',
        'request.region': 'Region VII',
      });
      expect(mockCollection.updateOne).toHaveBeenCalled();
    });
  });

  describe('findByCommodityAndRegion', () => {
    it('should return price data for specific commodity and region', async () => {
      const mockDocuments = [
        {
          _id: '123',
          commodity: { name: 'Rice', specifications: 'Regular Milled Rice' },
          markets: [{ name: 'TABUNOK PUBLIC MARKET' }],
          request: { commodity: 'Rice', region: 'Region VII', count: 10 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCollection.find().sort().toArray.mockResolvedValue(mockDocuments);

      const result = await repository.findByCommodityAndRegion('Rice', 'Region VII');

      expect(result).toHaveLength(1);
      expect(result[0].commodity.name).toBe('Rice');
      expect(mockCollection.find).toHaveBeenCalledWith({
        'request.commodity': 'Rice',
        'request.region': 'Region VII',
      });
    });
  });

  describe('findByCommodity', () => {
    it('should return price data for specific commodity', async () => {
      const mockDocuments = [
        {
          _id: '123',
          commodity: { name: 'Rice', specifications: 'Regular Milled Rice' },
          markets: [{ name: 'TABUNOK PUBLIC MARKET' }],
          request: { commodity: 'Rice', region: 'Region VII', count: 10 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCollection.find().sort().toArray.mockResolvedValue(mockDocuments);

      const result = await repository.findByCommodity('Rice');

      expect(result).toHaveLength(1);
      expect(result[0].commodity.name).toBe('Rice');
      expect(mockCollection.find).toHaveBeenCalledWith({
        'request.commodity': 'Rice',
      });
    });
  });

  describe('findByRegion', () => {
    it('should return price data for specific region', async () => {
      const mockDocuments = [
        {
          _id: '123',
          commodity: { name: 'Rice', specifications: 'Regular Milled Rice' },
          markets: [{ name: 'TABUNOK PUBLIC MARKET' }],
          request: { commodity: 'Rice', region: 'Region VII', count: 10 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCollection.find().sort().toArray.mockResolvedValue(mockDocuments);

      const result = await repository.findByRegion('Region VII');

      expect(result).toHaveLength(1);
      expect(result[0].commodity.name).toBe('Rice');
      expect(mockCollection.find).toHaveBeenCalledWith({
        'request.region': 'Region VII',
      });
    });
  });

  describe('findAll', () => {
    it('should return all price data', async () => {
      const mockDocuments = [
        {
          _id: '123',
          commodity: { name: 'Rice', specifications: 'Regular Milled Rice' },
          markets: [{ name: 'TABUNOK PUBLIC MARKET' }],
          request: { commodity: 'Rice', region: 'Region VII', count: 10 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCollection.find().sort().toArray.mockResolvedValue(mockDocuments);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].commodity.name).toBe('Rice');
      expect(mockCollection.find).toHaveBeenCalledWith({});
    });
  });

  describe('deleteByCommodityAndRegion', () => {
    it('should delete price data for specific commodity and region', async () => {
      mockCollection.deleteMany.mockResolvedValue({ deletedCount: 1 });

      await repository.deleteByCommodityAndRegion('Rice', 'Region VII');

      expect(mockCollection.deleteMany).toHaveBeenCalledWith({
        'request.commodity': 'Rice',
        'request.region': 'Region VII',
      });
    });
  });
});
