// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationMutationInput!) {
    createOrganization(input: $input)
      @rest(
        type: "Organization"
        path: "/organization/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...organizationFields
    }
  }

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

  mutation PatchOrganization(
    $id: ID!
    $input: UpdateOrganizationMutationInput!
  ) {
    patchOrganization(id: $id, input: $input)
      @rest(
        type: "Organization"
        path: "/organization/{args.id}/"
        method: "PATCH"
        bodyKey: "input"
      ) {
      ...organizationFields
    }
  }

  mutation UpdateOrganization($input: UpdateOrganizationMutationInput!) {
    updateOrganization(input: $input)
      @rest(
        type: "Organization"
        path: "/organization/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...organizationFields
    }
  }
`;
