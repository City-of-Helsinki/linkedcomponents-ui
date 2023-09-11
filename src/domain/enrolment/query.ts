// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SIGNUP = gql`
  query Signup($id: ID!, $createPath: Any) {
    signup(id: $id) @rest(type: "Signup", pathBuilder: $createPath) {
      ...signupFields
    }
  }

  fragment signupFields on Signup {
    id
    attendeeStatus
    cancellationCode
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
