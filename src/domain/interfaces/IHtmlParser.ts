import { PriceData } from '../entities/PriceData';

export interface IHtmlParser {
  parsePriceData(html: string): PriceData;
}
