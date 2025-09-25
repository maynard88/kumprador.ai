import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { IPriceDataRepository } from '../../domain/interfaces/IPriceDataRepository';
import { PriceData } from '../../domain/entities/PriceData';
import { Market } from '../../domain/entities/Market';
import { Commodity } from '../../domain/entities/Commodity';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { API_CONFIG, ERROR_MESSAGES, COMMODITY_UTILS } from '../../config/constants';

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

  async syncDTIPriceData(request: PriceRequest): Promise<{ allMarkets: Market[]; allPriceData: any[] }> {
    try {
      console.log(`Syncing DTI price data for ${request.commodity} in ${request.region} with count ${request.count}`);
      const allMarkets = await this.getMarkets(request);
      const allPriceData = await this.getCommodityPrices(request);
       console.log('Markets:', allMarkets);
       console.log('Price Data Count:', allPriceData.length);
       allPriceData.forEach((item, index) => {
         console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
       });
      // Save the parsed price data to MongoDB
      // for (const priceData of allPriceData) {
      //   await this.priceDataRepository.save(priceData, request);
      // }
      
      return { allMarkets, allPriceData };
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.PRICE_DATA_FETCH_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getMarkets(request: PriceRequest): Promise<Market[]> {
    const url = `${this.baseUrl}/tbl_price_get_comm_header.php`;
    const formData = {
      commodity: request.commodity,
      region: request.region,
      count: request.count.toString(),
    };

    const htmlResponse = await this.httpClient.post<string>(url, formData);
    //console.log(htmlResponse);
    const markets = this.htmlParser.parseMarketData(htmlResponse);

    //console.log(markets);

    return markets;
  }

  private async getCommodityPrices(request: PriceRequest): Promise<any[]> {
    const allCommodityIds = COMMODITY_UTILS.getAllIds();
    const priceDataResults: any[] = [];

    console.log(`Fetching prices for ${allCommodityIds.length} commodities...`);

    for (const commodityId of allCommodityIds) {
      try {
        const url = `${this.baseUrl}/tbl_price_get_comm_price.php`;
        const formData = {
          commodity: commodityId.toString(),
          region: request.region,
          count: request.count.toString(),
        };

        console.log(`Fetching prices for commodity ID: ${commodityId}`);
        //console.log(formData);

        const htmlResponse = await this.httpClient.post<string>(url, formData);
        //console.log(htmlResponse);
        const priceData = this.htmlParser.parseCommodityPricesData(htmlResponse);
        priceDataResults.push(...priceData);
        const commodityName = COMMODITY_UTILS.getNameById(commodityId) || `Commodity ${commodityId}`;
        console.log(`Successfully fetched prices for ${commodityName}`);
        break;
    
      } catch (error) {
        console.error(`Error fetching prices for commodity ID ${commodityId}:`, error);
        // Continue with other commodities even if one fails
      }
    }

    console.log(`Completed fetching prices. Total commodities with data: ${priceDataResults.length}`);
    return priceDataResults;
  }


}
