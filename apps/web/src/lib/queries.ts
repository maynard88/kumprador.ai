import { gql } from '@apollo/client'

export const GET_PRICE_DATA = gql`
  query GetPriceData($input: PriceRequestInput!) {
    syncDTIPriceData(input: $input) {
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
