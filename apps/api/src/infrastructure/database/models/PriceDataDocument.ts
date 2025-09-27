import { PriceData } from '../../../domain/entities/PriceData';
import { PriceRequest } from '../../../domain/value-objects/PriceRequest';

export interface PriceDataDocument {
  _id?: string;
  commodity: {
    name: string;
    specifications: string;
  };
  markets: Array<{
    name: string;
  }>;
  request: {
    commodity: string;
    region: string;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketGroupedDataDocument {
  _id?: string;
  currentDate: Date;
  marketGroupedData: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class PriceDataDocumentMapper {
  static toDocument(priceData: PriceData, request: PriceRequest): Omit<PriceDataDocument, '_id'> {
    return {
      commodity: {
        name: priceData.commodity.name,
        specifications: priceData.commodity.specifications,
      },
      markets: priceData.markets.map(market => ({
        name: market.name,
      })),
      request: {
        commodity: request.commodity,
        region: request.region,
        count: request.count,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toEntity(document: PriceDataDocument): PriceData {
    const { Commodity } = require('../../../domain/entities/Commodity');
    const { Market } = require('../../../domain/entities/Market');
    
    const commodity = Commodity.fromStrings(
      document.commodity.name,
      document.commodity.specifications
    );
    
    const markets = document.markets.map(marketDoc => 
      Market.fromString(marketDoc.name)
    );
    
    return PriceData.create(commodity, markets);
  }
}
