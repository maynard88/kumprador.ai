import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type CommodityPrice {
    commodity: String!
    commodityName: String!
    commodityType: String
    specification: String!
    price: String
  }

  type MarketData {
    marketIndex: Int!
    marketName: String!
    commodities: [CommodityPrice!]!
  }

  input PriceRequestInput {
    region: String!
    count: Int!
  }

  type Query {
    syncDTIPriceData(input: PriceRequestInput): [MarketData!]!
  }
`;
