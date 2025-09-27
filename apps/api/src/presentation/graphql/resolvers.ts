import { GetPriceDataUseCase } from '../../application/use-cases/GetPriceDataUseCase';
import { AuthenticatedRequest } from '../../middleware/apiKeyAuth';

export interface Context {
  getPriceDataUseCase: GetPriceDataUseCase;
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
};
