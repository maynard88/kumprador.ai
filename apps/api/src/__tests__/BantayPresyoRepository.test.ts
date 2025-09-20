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
      parsePriceData: jest.fn(),
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

  describe('getPriceData', () => {
    it('should fetch, parse, and save price data successfully', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';
      const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];
      const expectedPriceData = PriceData.create(commodity, markets);

      mockHttpClient.post.mockResolvedValue(mockHtmlResponse);
      mockHtmlParser.parsePriceData.mockReturnValue(expectedPriceData);
      mockPriceDataRepository.save.mockResolvedValue();

      const result = await repository.getPriceData(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'http://www.bantaypresyo.da.gov.ph/tbl_price_get_comm_header.php',
        {
          commodity: 'Rice',
          region: 'Region VII',
          count: '10',
        }
      );
      expect(mockHtmlParser.parsePriceData).toHaveBeenCalledWith(mockHtmlResponse);
      expect(mockPriceDataRepository.save).toHaveBeenCalledWith(expectedPriceData, request);
      expect(result).toEqual(expectedPriceData);
    });

    it('should throw error when HTTP request fails', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const error = new Error('Network error');

      mockHttpClient.post.mockRejectedValue(error);

      await expect(repository.getPriceData(request)).rejects.toThrow(
        'Failed to fetch price data: Network error'
      );

      expect(mockPriceDataRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when HTML parsing fails', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';
      const error = new Error('Parsing error');

      mockHttpClient.post.mockResolvedValue(mockHtmlResponse);
      mockHtmlParser.parsePriceData.mockImplementation(() => {
        throw error;
      });

      await expect(repository.getPriceData(request)).rejects.toThrow(
        'Failed to fetch price data: Parsing error'
      );

      expect(mockPriceDataRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when saving to database fails', async () => {
      const request = new PriceRequest('Rice', 'Region VII', 10);
      const mockHtmlResponse = '<html>mock response</html>';
      const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');
      const markets = [Market.fromString('TABUNOK PUBLIC MARKET')];
      const expectedPriceData = PriceData.create(commodity, markets);
      const error = new Error('Database error');

      mockHttpClient.post.mockResolvedValue(mockHtmlResponse);
      mockHtmlParser.parsePriceData.mockReturnValue(expectedPriceData);
      mockPriceDataRepository.save.mockRejectedValue(error);

      await expect(repository.getPriceData(request)).rejects.toThrow(
        'Failed to fetch price data: Database error'
      );
    });
  });
});
