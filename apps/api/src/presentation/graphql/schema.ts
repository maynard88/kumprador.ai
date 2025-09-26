import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type CommodityPrice {
    commodity: String!
    specification: String!
    price: String
  }

  type MarketData {
    marketIndex: Int!
    marketName: String!
    commodities: [CommodityPrice!]!
  }

  input PriceRequestInput {
    commodity: String!
    region: String!
    count: Int!
  }

  type Query {
    syncDTIPriceData(input: PriceRequestInput!): [MarketData!]!
  }
`;
