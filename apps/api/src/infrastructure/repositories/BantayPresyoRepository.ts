import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { IPriceDataRepository } from '../../domain/interfaces/IPriceDataRepository';
import { PriceData } from '../../domain/entities/PriceData';
import { Market } from '../../domain/entities/Market';
import { Commodity } from '../../domain/entities/Commodity';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { API_CONFIG, ERROR_MESSAGES, COMMODITY_UTILS } from '../../config/constants';
import { REGION_VII_MARKETS } from '../../config/marketData';

export class BantayPresyoRepository implements IBantayPresyoRepository {
  private readonly baseUrl: string;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly htmlParser: IHtmlParser,
    private readonly priceDataRepository: IPriceDataRepository,
    baseUrl: string = API_CONFIG.BANTAY_PRESYO_BASE_URL
  ) {
    this.baseUrl = baseUrl;
  }

  async syncDTIPriceData(request: PriceRequest): Promise<any[]> {
    try {
      console.log(`Syncing DTI price data for ${request.commodity} in ${request.region} with count ${request.count}`);
      
      // Check if data already exists for today
      const existingData = await this.priceDataRepository.getTodayMarketGroupedData();
      if (existingData && existingData.length > 0) {
        console.log('Data already exists for today, returning cached data from database');
        return existingData;
      }

      console.log('No data found for today, fetching fresh data from API');
      //const allMarkets = await this.getMarkets(request);
      const allPriceData = await this.getCommodityPrices(request);
      
      // Transform data to market-grouped format
      const marketGroupedData = this.transformToMarketGroupedFormat(allPriceData);

      // Save market grouped data to MongoDB with current date
      await this.priceDataRepository.saveMarketGroupedData(marketGroupedData, request);

      return marketGroupedData;
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.PRICE_DATA_FETCH_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  /**
   * Transform allPriceData into market-grouped format
   * @param allPriceData Array of price data with marketIndex and prices
   * @returns Array of market objects with their commodities
   */
  transformToMarketGroupedFormat(allPriceData: any[]): any[] {
    const marketGroupedData: any[] = [];
    
    // Initialize markets with empty commodities arrays
    for (let i = 0; i < REGION_VII_MARKETS.length; i++) {
      marketGroupedData.push({
        marketIndex: i,
        marketName: REGION_VII_MARKETS[i],
        commodities: []
      });
    }
    
    // Group commodities by market
    allPriceData.forEach(priceItem => {
      const { commodity, specification, prices, commodityType } = priceItem;
      
      prices.forEach((priceData: any) => {
        const { marketIndex, price } = priceData;
        
        if (marketIndex >= 0 && marketIndex < marketGroupedData.length) {
          marketGroupedData[marketIndex].commodities.push({
            commodity,
            commodityName: commodity, // The commodity field already contains the name
            commodityType,
            specification,
            price
          });
        }
      });
    });
    
    return marketGroupedData;
  }

  private async getMarkets(request: PriceRequest): Promise<Market[]> {
    const url = `${this.baseUrl}/tbl_price_get_comm_header.php`;
    const formData = {
      commodity: request.commodity,
      region: request.region,
      count: request.count.toString(),
    };

    const htmlResponse = await this.httpClient.post<string>(url, formData);

    const markets = this.htmlParser.parseMarketData(htmlResponse);

    return markets;
  }

  private async getCommodityPrices(request: PriceRequest): Promise<any[]> {
    const allCommodityIds = COMMODITY_UTILS.getAllIds();
    const priceDataResults: any[] = [];

    for (const commodityId of allCommodityIds) {
      try {
        const url = `${this.baseUrl}/tbl_price_get_comm_price.php`;
        const formData = {
          commodity: commodityId.toString(),
          region: request.region,
          count: request.count.toString(),
        };

        console.log(`Fetching prices for commodity ID: ${commodityId}`);

        const htmlResponse = await this.httpClient.post<string>(url, formData);

        const priceData = this.htmlParser.parseCommodityPricesData(htmlResponse);

        
        // Add commodityType to each price data object
        const priceDataWithType = priceData.map(item => ({
          ...item,
          commodityType: COMMODITY_UTILS.getNameById(commodityId),
        }));
        
        priceDataResults.push(...priceDataWithType);
        const commodityName = COMMODITY_UTILS.getNameById(commodityId) || `Commodity ${commodityId}`;
        console.log(`Successfully fetched prices for ${commodityName}`);
        
      } catch (error) {
        console.error(`Error fetching prices for commodity ID ${commodityId}:`, error);
        // Continue with other commodities even if one fails
      }
    }

    console.log(`Completed fetching prices. Total commodities with data: ${priceDataResults.length}`);
    return priceDataResults;
  }


}
