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

  type ConversationMessage {
    role: String!
    content: String!
    timestamp: String!
  }

  input ConversationMessageInput {
    role: String!
    content: String!
    timestamp: String!
  }

  input ConversationContextInput {
    messages: [ConversationMessageInput!]!
    budget: Int
    preferences: String
  }

  type Query {
    syncDTIPriceData(input: PriceRequestInput): [MarketData!]!
  }

  type Mutation {
    processConversation(
      context: ConversationContextInput!
      region: String
      count: Int
    ): String!
  }
`;
