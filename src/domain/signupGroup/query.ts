// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SIGNUP_GROUP = gql`
  fragment createSignupGroupFields on CreateSignupGroupResponse {
    extraInfo
    id
    registration
    signups {
      ...signupFields
    }
  }
`;
