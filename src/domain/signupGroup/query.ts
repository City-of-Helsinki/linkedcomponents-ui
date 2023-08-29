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

  fragment signupGroupFields on SignupGroup {
    extraInfo
    id
    registration
    signups {
      ...signupFields
    }
  }

  query SignupGroup($id: ID!) {
    signupGroup(id: $id)
      @rest(
        type: "SignupGroup"
        path: "/signup_group/{args.id}/"
        method: "GET"
      ) {
      ...signupGroupFields
    }
  }
`;
