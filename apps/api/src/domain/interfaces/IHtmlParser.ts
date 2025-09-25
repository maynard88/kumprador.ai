import { Market } from '../entities/Market';
import { PriceData } from '../entities/PriceData';

export interface IHtmlParser {
  parseMarketData(html: string): Market[];
  parseCommodityPricesData(html: string): any[];
}
