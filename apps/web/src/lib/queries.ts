import { gql } from '@apollo/client'

export const GET_PRICE_DATA = gql`
  query GetPriceData($input: PriceRequestInput!) {
    getPriceData(input: $input) {
      commodity {
        name
        specifications
      }
      markets {
        name
      }
    }
  }
`
