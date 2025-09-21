import { PriceData } from '../entities/PriceData';
import { PriceRequest } from '../value-objects/PriceRequest';

export interface IBantayPresyoRepository {
  syncDTIPriceData(request: PriceRequest): Promise<PriceData>;
}

