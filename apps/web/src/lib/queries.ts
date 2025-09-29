import { gql } from '@apollo/client'

export const GET_PRICE_DATA = gql`
  query GetPriceData($input: PriceRequestInput!) {
    syncDTIPriceData(input: $input) {
      marketIndex
      marketName
      commodities {
        commodity
        specification
        price
      }
    }
  }
`

export const PROCESS_CONVERSATION = gql`
  mutation ProcessConversation($context: ConversationContextInput!, $region: String, $count: Int) {
    processConversation(context: $context, region: $region, count: $count)
  }
`
