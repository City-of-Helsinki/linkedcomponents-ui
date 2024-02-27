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

  query PriceGroup($id: ID!) {
    priceGroup(id: $id)
      @rest(type: "PriceGroup", path: "/price_group/{args.id}/") {
      ...priceGroupFields
    }
  }
`;
