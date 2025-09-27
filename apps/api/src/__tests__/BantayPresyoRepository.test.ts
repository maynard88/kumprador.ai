import { BantayPresyoRepository } from '../infrastructure/repositories/BantayPresyoRepository';
import { IHttpClient } from '../domain/interfaces/IHttpClient';
import { IHtmlParser } from '../domain/interfaces/IHtmlParser';
import { IPriceDataRepository } from '../domain/interfaces/IPriceDataRepository';
import { PriceData } from '../domain/entities/PriceData';
import { PriceRequest } from '../domain/value-objects/PriceRequest';
import { Commodity } from '../domain/entities/Commodity';
import { Market } from '../domain/entities/Market';

describe('BantayPresyoRepository', () => {
  let repository: BantayPresyoRepository;
  let mockHttpClient: jest.Mocked<IHttpClient>;
  let mockHtmlParser: jest.Mocked<IHtmlParser>;
  let mockPriceDataRepository: jest.Mocked<IPriceDataRepository>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
    } as any;

    mockHtmlParser = {
      parseMarketData: jest.fn(),
      parseCommodityPricesData: jest.fn(),
    } as any;

    mockPriceDataRepository = {
      save: jest.fn(),
      findByCommodityAndRegion: jest.fn(),
      findByCommodity: jest.fn(),
      findByRegion: jest.fn(),
      findAll: jest.fn(),
      deleteByCommodityAndRegion: jest.fn(),
    } as any;

    repository = new BantayPresyoRepository(
      mockHttpClient,
      mockHtmlParser,
      mockPriceDataRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncDTIPriceData', () => {
    it('should fetch, parse, and save price data for all commodities successfully', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];

      // Mock the HTTP client to return the same response for all commodity calls
      mockHttpClient.post.mockResolvedValue(mockHtmlResponse);
      mockHtmlParser.parseCommodityPricesData.mockReturnValue([
        {
          commodity: 'Rice',
          specification: 'Regular',
          prices: [{ marketIndex: 0, price: 50.0 }]
        }
      ]);
      mockPriceDataRepository.save.mockResolvedValue();

      const result = await repository.syncDTIPriceData(request);

      // Should call the price endpoint for each commodity ID
      expect(mockHttpClient.post).toHaveBeenCalledTimes(8); // 8 commodity IDs
      expect(mockHtmlParser.parseCommodityPricesData).toHaveBeenCalledTimes(8);
      
      // Should return an array of market-grouped data
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Each market should have the expected structure
      result.forEach((market: any) => {
        expect(market).toHaveProperty('marketIndex');
        expect(market).toHaveProperty('marketName');
        expect(market).toHaveProperty('commodities');
        expect(Array.isArray(market.commodities)).toBe(true);
      });
    });

    it('should handle errors gracefully and continue with other commodities', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];

      // Mock some requests to fail and others to succeed
      mockHttpClient.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockHtmlResponse)
        .mockResolvedValue(mockHtmlResponse);
      
      mockHtmlParser.parseCommodityPricesData.mockReturnValue([
        {
          commodity: 'Rice',
          specification: 'Regular',
          prices: [{ marketIndex: 0, price: 50.0 }]
        }
      ]);

      const result = await repository.syncDTIPriceData(request);

      // Should return results for successful requests
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty market data gracefully', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';

      mockHttpClient.post.mockResolvedValue(mockHtmlResponse);
      mockHtmlParser.parseCommodityPricesData.mockReturnValue([]); // Empty price data

      const result = await repository.syncDTIPriceData(request);

      // Should return an array of market-grouped data
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
