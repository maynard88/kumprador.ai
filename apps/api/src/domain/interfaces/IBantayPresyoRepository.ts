import { PriceData } from '../entities/PriceData';
import { Market } from '../entities/Market';
import { PriceRequest } from '../value-objects/PriceRequest';

export interface IBantayPresyoRepository {
  syncDTIPriceData(request: PriceRequest): Promise<{ allMarkets: Market[]; allPriceData: PriceData[] }>;
}

