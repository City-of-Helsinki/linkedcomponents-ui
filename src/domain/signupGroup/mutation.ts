// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_SIGNUP_GROUP = gql`
  mutation CreateSignupGroup($input: CreateSignupGroupMutationInput!) {
    createSignupGroup(input: $input)
      @rest(
        type: "CreateSignupGroupResponse"
        path: "/signup_group/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...createSignupGroupFields
    }
  }
`;
