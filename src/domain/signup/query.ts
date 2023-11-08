// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SIGNUP = gql`
  query Signup($id: ID!) {
    signup(id: $id)
      @rest(type: "Signup", path: "/signup/{args.id}/", method: "GET") {
      ...signupFields
    }
  }

  fragment signupFields on Signup {
    id
    attendeeStatus
    city
    dateOfBirth
    email
    extraInfo
    firstName
    lastName
    membershipNumber
    nativeLanguage
    notifications
    phoneNumber
    presenceStatus
    responsibleForGroup
    serviceLanguage
    signupGroup
    streetAddress
    zipcode
  }
`;
