import * as cheerio from 'cheerio';
import { IHtmlParser } from '../../domain/interfaces/IHtmlParser';
import { Market } from '../../domain/entities/Market';
import { PriceData } from '../../domain/entities/PriceData';
import { Commodity } from '../../domain/entities/Commodity';
import { getMarketsForRegion } from '../../config/marketData';

export class CheerioHtmlParser implements IHtmlParser {
  parseMarketData(html: string): Market[] {
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

    return markets;
  }

  parseCommodityPricesData(html: string): any[] {
    const $ = cheerio.load(html);
    const priceDataResults: any[] = [];

    // If no table structure is found, try to wrap the content in a table
    if ($('tr').length === 0) {
      // Check if the HTML contains tr elements as text
      if (html.includes('<tr') && html.includes('</tr>')) {
        // Wrap the content in a table structure
        const wrappedHtml = `<table>${html}</table>`;
        const $wrapped = cheerio.load(wrappedHtml);
        
        // Use the wrapped version
        $wrapped('tr').each((index, element) => {
          const rowData = this.processTableRow($wrapped, element, priceDataResults);
          console.log("rowData", rowData);
          if (rowData) {
            priceDataResults.push(rowData);
          }
        });
        return priceDataResults;
      }
    }
    
    // Find all table rows with commodity data
    $('tr').each((index, element) => {
      const rowData = this.processTableRow($, element, priceDataResults);
      if (rowData) {
        priceDataResults.push(rowData);
      }
    });
    return priceDataResults;
  }

  private processTableRow($: cheerio.CheerioAPI, element: any, priceDataResults: any[]): any {
    const $row = $(element);
    const $cells = $row.find('td');
    
    // Extract all cell data
    const cells: string[] = [];
    $cells.each((index, cellElement) => {
      cells.push($(cellElement).text().trim());
    });
    
    // Return structured JSON with meaningful field names
    return {
      commodity: cells[0] || '',
      specification: cells[1] || '',
      prices: cells.slice(2).map((price, index) => ({
        marketIndex: index,
        price: price === 'N/A' ? null : parseFloat(price) || null
      }))
    };
  }
}
