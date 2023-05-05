// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENTS = gql`
  query Enrolments(
    $attendeeStatus: AttendeeStatus
    $registration: ID!
    $text: String
    $createPath: Any
  ) {
    enrolments(
      attendeeStatus: $attendeeStatus
      registration: $registration
      text: $text
    ) @rest(type: "Enrolment", pathBuilder: $createPath) {
      ...enrolmentFields
    }
  }
`;
