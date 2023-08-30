// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentPeopleResponseFields on EnrolmentPeopleResponse {
    count
    people {
      ...enrolmentFields
    }
  }

  fragment createEnrolmentFields on CreateEnrolmentResponse {
    attending {
      ...enrolmentPeopleResponseFields
    }
    waitlisted {
      ...enrolmentPeopleResponseFields
    }
  }

  query Enrolment($id: ID!, $createPath: Any) {
    enrolment(id: $id) @rest(type: "Enrolment", pathBuilder: $createPath) {
      ...enrolmentFields
    }
  }

  fragment enrolmentFields on Enrolment {
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
    serviceLanguage
    streetAddress
    zipcode
  }
`;
