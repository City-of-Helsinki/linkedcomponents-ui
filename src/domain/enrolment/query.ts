// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentFields on Enrolment {
    id
    cancellationCode
    city
    email
    extraInfo
    membershipNumber
    name
    notifications
    phoneNumber
  }

  query Enrolment($id: ID!, $createPath: Any) {
    enrolment(id: $id) @rest(type: "Enrolment", pathBuilder: $createPath) {
      ...enrolmentFields
    }
  }
`;
