import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { IPriceDataRepository } from '../../domain/interfaces/IPriceDataRepository';
import { PriceData } from '../../domain/entities/PriceData';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { API_CONFIG, ERROR_MESSAGES } from '../../config/constants';

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

  async getPriceData(request: PriceRequest): Promise<PriceData> {
    try {
      const url = `${this.baseUrl}/tbl_price_get_comm_header.php`;
      const formData = {
        commodity: request.commodity,
        region: request.region,
        count: request.count.toString(),
      };
      const htmlResponse = await this.httpClient.post<string>(url, formData);
      const priceData = this.htmlParser.parsePriceData(htmlResponse);
      
      // Save the parsed price data to MongoDB
      //await this.priceDataRepository.save(priceData, request);
      
      return priceData;
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.PRICE_DATA_FETCH_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
