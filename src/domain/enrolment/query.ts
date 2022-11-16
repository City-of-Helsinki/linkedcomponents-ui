// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentPersonFields on EnrolmentPerson {
    id
    name
  }

  fragment enrolmentPeopleResponseFields on EnrolmentPeopleResponse {
    count
    people {
      ...enrolmentPersonFields
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

  fragment enrolmentFields on Enrolment {
    id
    attendeeStatus
    cancellationCode
    city
    dateOfBirth
    email
    extraInfo
    membershipNumber
    name
    nativeLanguage
    notifications
    phoneNumber
    serviceLanguage
    streetAddress
    zipcode
  }

  query Enrolment($id: ID!, $createPath: Any) {
    enrolment(id: $id) @rest(type: "Enrolment", pathBuilder: $createPath) {
      ...enrolmentFields
    }
  }
`;
