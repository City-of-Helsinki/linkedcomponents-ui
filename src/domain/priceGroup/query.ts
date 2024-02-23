// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_PRICE_GROUP = gql`
  fragment priceGroupFields on PriceGroup {
    id
    description {
      ...localisedFields
    }
    isFree
    publisher
  }
`;
