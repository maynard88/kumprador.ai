import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceData } from '../../domain/entities/PriceData';
import { Market } from '../../domain/entities/Market';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';

export class GetPriceDataUseCase {
  constructor(private readonly bantayPresyoRepository: IBantayPresyoRepository) {}

  async execute(commodity: string, region: string, count: number): Promise<{ allMarkets: Market[]; allPriceData: PriceData[] }> {
    const request = PriceRequest.create(commodity, region, count);
    await PriceRequestValidator.validate(request);
    return await this.bantayPresyoRepository.syncDTIPriceData(request);
  }
}
