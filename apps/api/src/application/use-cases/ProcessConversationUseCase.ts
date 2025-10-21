import { IOpenAIRepository, ConversationContext } from '../../domain/interfaces/IOpenAIRepository';
import { IBantayPresyoRepository } from '../../domain/interfaces/IBantayPresyoRepository';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { PriceRequestValidator } from '../validators/PriceRequestValidator';
import { PriceDataCache } from '../../infrastructure/cache/PriceDataCache';
import { PriceData } from '../../domain/entities/PriceData';
import { Commodity } from '../../domain/entities/Commodity';
import { Market } from '../../domain/entities/Market';

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
        const priceDataEntities = this.convertToPriceDataEntities(priceData);
        context.priceData = priceDataEntities;
      }

      // Process the conversation with OpenAI
      return await this.openAIRepository.processConversation(context);
    } catch (error) {
      throw new Error(`Failed to process conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private convertToPriceDataEntities(priceData: any[]): PriceData[] {
    const commodityMap = new Map<string, { commodity: any, markets: any[] }>();

    // Group commodities by name and collect their market data
    priceData.forEach((market: any) => {
      if (market.commodities && Array.isArray(market.commodities)) {
        market.commodities.forEach((commodity: any) => {
          if (commodity.price !== null && commodity.price !== undefined) {
            const commodityName = commodity.commodityName || commodity.commodity;
            const commodityType = commodity.commodityType || '';
            const specification = commodity.specification || '';
            
            if (!commodityMap.has(commodityName)) {
              commodityMap.set(commodityName, {
                commodity: {
                  name: commodityName,
                  type: commodityType,
                  specification: specification
                },
                markets: []
              });
            }
            
            commodityMap.get(commodityName)!.markets.push({
              name: market.marketName || market.marketIndex,
              price: commodity.price
            });
          }
        });
      }
    });

    // Convert to PriceData entities
    return Array.from(commodityMap.values()).map(({ commodity, markets }) => {
      const commodityEntity = new Commodity(commodity.name, commodity.specification);
      const marketEntities = markets.map(market => 
        new Market(market.name, market.price)
      );
      return new PriceData(commodityEntity, marketEntities);
    });
  }
}
