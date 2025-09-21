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

        return results.map((result: any) => ({
          commodity: {
            name: result.commodity.name,
            specifications: result.commodity.specifications,
          },
          markets: result.markets.map((market: any) => ({
            name: market.name,
          })),
        }));
      } catch (error) {
        throw new Error(`Failed to fetch price data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
};
