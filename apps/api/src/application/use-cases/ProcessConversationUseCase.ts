import { IOpenAIRepository, ConversationContext } from '../../domain/interfaces/IOpenAIRepository';
import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';
import { PriceDataCache } from '../../infrastructure/cache/PriceDataCache';

export class ProcessConversationUseCase {
  private readonly priceDataCache: PriceDataCache;

  constructor(
    private readonly openAIRepository: IOpenAIRepository,
    private readonly bantayPresyoRepository: IBantayPresyoRepository
  ) {
    this.priceDataCache = PriceDataCache.getInstance();
  }

  async execute(
    context: ConversationContext,
    region: string = '070000000',
    count: number = 23
  ): Promise<string> {
    console.log('ProcessConversationUseCase: execute method called');
    try {
      // If we don't have price data in context, try to get it from cache first
      if (!context.priceData || context.priceData.length === 0) {

        let priceData: any[] | null;
        // Try to get from cache first
         priceData = this.priceDataCache.get(region, count);
        
        if (!priceData) {
          console.log('ProcessConversationUseCase: Cache miss, fetching fresh price data from API');
          const request = PriceRequest.create('all', region, count);
          await PriceRequestValidator.validate(request);
          priceData = await this.bantayPresyoRepository.syncDTIPriceData(request);
          
          // Store in cache for future requests
          this.priceDataCache.set(region, count, priceData);
          console.log('ProcessConversationUseCase: Price data cached successfully');
        } else {
          console.log('ProcessConversationUseCase: Cache hit, using cached price data');
        }
        
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
