import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceData } from '../../domain/entities/PriceData';
import { Market } from '../../domain/entities/Market';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';
import { PriceDataCache } from '../../infrastructure/cache/PriceDataCache';

export class GetPriceDataUseCase {
  private readonly priceDataCache: PriceDataCache;

  constructor(private readonly bantayPresyoRepository: IBantayPresyoRepository) {
    this.priceDataCache = PriceDataCache.getInstance();
  }

  async execute(commodity: string, region: string, count: number): Promise<any[]> {
    // Try to get from cache first
    let priceData = this.priceDataCache.get(region, count);
    
    if (!priceData) {
      console.log('GetPriceDataUseCase: Cache miss, fetching from API');
      const request = PriceRequest.create(commodity, region, count);
      await PriceRequestValidator.validate(request);
      priceData = await this.bantayPresyoRepository.syncDTIPriceData(request);
      
      // Store in cache for future requests
      this.priceDataCache.set(region, count, priceData);
      console.log('GetPriceDataUseCase: Price data cached successfully');
    } else {
      console.log('GetPriceDataUseCase: Cache hit, using cached data');
    }
    
    return priceData;
  }
}
