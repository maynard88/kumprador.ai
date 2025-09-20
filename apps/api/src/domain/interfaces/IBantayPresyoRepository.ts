import { PriceData } from '../entities/PriceData';
import { PriceRequest } from '../value-objects/PriceRequest';

export interface IBantayPresyoRepository {
  getPriceData(request: PriceRequest): Promise<PriceData>;
}

