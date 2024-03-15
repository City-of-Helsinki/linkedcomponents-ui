// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_PRICE_GROUP = gql`
  mutation CreatePriceGroup($input: CreatePriceGroupMutationInput!) {
    createPriceGroup(input: $input)
      @rest(
        type: "PriceGroup"
        path: "/price_group/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...priceGroupFields
    }
  }

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

  mutation UpdatePriceGroup($input: UpdatePriceGroupMutationInput!) {
    updatePriceGroup(input: $input)
      @rest(
        type: "PriceGroup"
        path: "/price_group/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...priceGroupFields
    }
  }
`;
