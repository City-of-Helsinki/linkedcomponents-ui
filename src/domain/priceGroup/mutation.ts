// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_PRICE_GROUP = gql`
  mutation DeletePriceGroup($id: Int!) {
    deletePriceGroup(id: $id)
      @rest(
        type: "NoContent"
        path: "/price_group/{args.id}/"
        method: "DELETE"
      ) {
      noContent
    }
  }
`;
