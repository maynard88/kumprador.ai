import { Market } from '../domain/entities/Market';
import { Commodity } from '../domain/entities/Commodity';
import { PriceData } from '../domain/entities/PriceData';

describe('PriceData', () => {
  it('should create a valid PriceData instance', () => {
    const commodity = Commodity.fromStrings('Rice', 'Regular Milled Rice');
    const markets = [
      Market.fromString('TABUNOK PUBLIC MARKET'),
      Market.fromString('MANDAUE CITY PUBLIC MARKET'),
    ];

    const priceData = PriceData.create(commodity, markets);

    expect(priceData.commodity.name).toBe('Rice');
    expect(priceData.commodity.specifications).toBe('Regular Milled Rice');
    expect(priceData.markets).toHaveLength(2);
    expect(priceData.markets[0].name).toBe('TABUNOK PUBLIC MARKET');
    expect(priceData.markets[1].name).toBe('MANDAUE CITY PUBLIC MARKET');
  });
});
