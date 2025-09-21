import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Market {
    name: String!
  }

  type Commodity {
    name: String!
    specifications: String!
  }

  type PriceData {
    commodity: Commodity!
    markets: [Market!]!
  }

  input PriceRequestInput {
    commodity: String!
    region: String!
    count: Int!
  }

  type Query {
    syncDTIPriceData(input: PriceRequestInput!): PriceData!
  }
`;
