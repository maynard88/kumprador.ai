import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceData } from '../../domain/entities/PriceData';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';

export class GetPriceDataUseCase {
  constructor(private readonly bantayPresyoRepository: IBantayPresyoRepository) {}

  async execute(commodity: string, region: string, count: number): Promise<PriceData> {
    const request = PriceRequest.create(commodity, region, count);
    await PriceRequestValidator.validate(request);
    return await this.bantayPresyoRepository.getPriceData(request);
  }
}
