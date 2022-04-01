// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_PLACE = gql`
  mutation DeletePlace($id: ID!) {
    deletePlace(id: $id)
      @rest(type: "NoContent", path: "/place/{args.id}/", method: "DELETE") {
      noContent
    }
  }
`;
