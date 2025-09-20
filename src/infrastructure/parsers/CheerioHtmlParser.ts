import * as cheerio from 'cheerio';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { PriceData } from '../../domain/entities/PriceData';
import { Commodity } from '../../domain/entities/Commodity';
import { Market } from '../../domain/entities/Market';

export class CheerioHtmlParser implements IHtmlParser {
  parsePriceData(html: string): PriceData {
    const $ = cheerio.load(html);
    
    // Extract market names from text content
    const allText = $('*').text();
    const textLines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Filter for market names
    const marketNames = textLines.filter(line => 
      line.includes('MARKET') && 
      !line.includes('COMMODITY') && 
      !line.includes('SPECIFICATIONS') &&
      line.length > 5
    );
    
    // Get unique market names and convert to Market objects
    const uniqueMarketNames = [...new Set(marketNames)];
    const markets: Market[] = uniqueMarketNames.map(name => Market.fromString(name));

    if (markets.length === 0) {
      throw new Error('No valid market data found');
    }

    // Use default commodity info
    const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');

    return PriceData.create(commodity, markets);
  }
}
