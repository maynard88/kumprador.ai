import { GetPriceDataUseCase } from '../../application/use-cases/GetPriceDataUseCase';
import { ProcessConversationUseCase } from '../../application/use-cases/ProcessConversationUseCase';
import { AuthenticatedRequest } from '../../middleware/apiKeyAuth';

export interface Context {
  getPriceDataUseCase: GetPriceDataUseCase;
  processConversationUseCase: ProcessConversationUseCase;
  isAuthenticated: boolean;
  req: AuthenticatedRequest;
}

export const resolvers = {
  Query: {
    syncDTIPriceData: async (_: any, { input }: any, { getPriceDataUseCase }: Context) => {
      try {
        const results = await getPriceDataUseCase.execute(
          'all', // Default commodity since we fetch all commodities
          input.region,
          input.count
        );

        return results.map((market: any) => ({
          marketIndex: market.marketIndex,
          marketName: market.marketName,
          commodities: market.commodities.map((commodity: any) => ({
            commodity: commodity.commodity,
            commodityName: commodity.commodityName,
            commodityType: commodity.commodityType,
            specification: commodity.specification,
            price: commodity.price,
          })),
        }));
      } catch (error) {
        throw new Error(`Failed to fetch price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
  Mutation: {
    processConversation: async (
      _: any, 
      { context, region = '070000000', count = 23 }: any, 
      { processConversationUseCase }: Context
    ) => {
      try {
        //console.log('processConversation', context, region, count);
        // Convert the input to the expected format
        const conversationContext = {
          messages: context.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          })),
          budget: context.budget,
          preferences: context.preferences
        };

        console.log('GraphQL Resolver: About to call processConversationUseCase.execute');
        return await processConversationUseCase.execute(conversationContext, region, count);
      } catch (error) {
        throw new Error(`Failed to process conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
};
