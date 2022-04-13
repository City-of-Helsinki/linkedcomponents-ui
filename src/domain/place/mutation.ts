// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_PLACE = gql`
  mutation CreatePlace($input: CreatePlaceMutationInput!) {
    createPlace(input: $input)
      @rest(type: "Place", path: "/place/", method: "POST", bodyKey: "input") {
      ...placeFields
    }
  }

  mutation DeletePlace($id: ID!) {
    deletePlace(id: $id)
      @rest(type: "NoContent", path: "/place/{args.id}/", method: "DELETE") {
      noContent
    }
  }

  mutation UpdatePlace($input: UpdatePlaceMutationInput!) {
    updatePlace(input: $input)
      @rest(
        type: "Place"
        path: "/place/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...placeFields
    }
  }
`;
