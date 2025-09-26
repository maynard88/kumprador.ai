import { GetPriceDataUseCase } from '../../application/use-cases/GetPriceDataUseCase';

export interface Context {
  getPriceDataUseCase: GetPriceDataUseCase;
}

export const resolvers = {
  Query: {
    syncDTIPriceData: async (_: any, { input }: any, { getPriceDataUseCase }: Context) => {
      try {
        const results = await getPriceDataUseCase.execute(
          input.commodity,
          input.region,
          input.count
        );

        return results.map((market: any) => ({
          marketIndex: market.marketIndex,
          marketName: market.marketName,
          commodities: market.commodities.map((commodity: any) => ({
            commodity: commodity.commodity,
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
