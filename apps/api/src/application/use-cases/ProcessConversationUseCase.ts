import { IOpenAIRepository, ConversationContext } from '../../domain/interfaces/IOpenAIRepository';
import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';

export class ProcessConversationUseCase {
  constructor(
    private readonly openAIRepository: IOpenAIRepository,
    private readonly bantayPresyoRepository: IBantayPresyoRepository
  ) {}

  async execute(
    context: ConversationContext,
    region: string = '070000000',
    count: number = 23
  ): Promise<string> {
    try {
      // If we don't have price data in context, fetch it
      if (!context.priceData || context.priceData.length === 0) {
        const request = PriceRequest.create('all', region, count);
        await PriceRequestValidator.validate(request);
        const priceData = await this.bantayPresyoRepository.syncDTIPriceData(request);
        
        // Convert the fetched data to PriceData entities
        const priceDataEntities = priceData.map((market: any) => ({
          commodity: {
            name: market.commodity || 'Unknown',
            specifications: market.specification || 'N/A'
          },
          markets: market.markets?.map((m: any) => ({
            name: m.marketName || 'Unknown Market',
            price: m.price ? parseFloat(m.price) : undefined
          })) || []
        }));

        context.priceData = priceDataEntities;
      }

      // Process the conversation with OpenAI
      return await this.openAIRepository.processConversation(context);
    } catch (error) {
      throw new Error(`Failed to process conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
