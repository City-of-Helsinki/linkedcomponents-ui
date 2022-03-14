// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
      @rest(
        type: "NoContent"
        path: "/organization/{args.id}/"
        method: "DELETE"
      ) {
      noContent
    }
  }
`;
