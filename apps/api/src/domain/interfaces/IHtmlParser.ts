import { Market } from '../entities/Market';

export interface IHtmlParser {
  parseMarketData(html: string): Market[];
}
