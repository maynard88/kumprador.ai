import { PriceData } from '../entities/PriceData';
import { PriceRequest } from '../value-objects/PriceRequest';

export interface IPriceDataRepository {
  save(priceData: PriceData, request: PriceRequest): Promise<void>;
  saveMarketGroupedData(marketGroupedData: any[], request: PriceRequest): Promise<void>;
  findByCommodityAndRegion(commodity: string, region: string): Promise<PriceData[]>;
  findByCommodity(commodity: string): Promise<PriceData[]>;
  findByRegion(region: string): Promise<PriceData[]>;
  findAll(): Promise<PriceData[]>;
  deleteByCommodityAndRegion(commodity: string, region: string): Promise<void>;
}
