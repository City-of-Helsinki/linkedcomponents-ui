// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_PRICE_GROUPS = gql`
  query PriceGroups(
    $description: String
    $isFree: Boolean
    $page: Int
    $pageSize: Int
    $publisher: [String]
    $sort: String
    $createPath: Any
  ) {
    priceGroups(
      description: $description
      isFree: $isFree
      page: $page
      pageSize: $pageSize
      publisher: $publisher
      sort: $sort
    ) @rest(type: "PriceGroupsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...priceGroupFields
      }
    }
  }
`;
