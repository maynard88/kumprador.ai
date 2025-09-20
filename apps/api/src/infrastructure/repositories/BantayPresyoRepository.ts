import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { PriceData } from '../../domain/entities/PriceData';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';

export class BantayPresyoRepository implements IBantayPresyoRepository {
  private readonly baseUrl: string;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly htmlParser: IHtmlParser,
    baseUrl: string = 'http://www.bantaypresyo.da.gov.ph'
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
      return this.htmlParser.parsePriceData(htmlResponse);
    } catch (error) {
      throw new Error(`Failed to fetch price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
