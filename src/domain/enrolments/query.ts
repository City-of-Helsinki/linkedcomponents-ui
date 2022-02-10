// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENTS = gql`
  query Enrolments(
    $attendeeStatus: AttendeeStatus
    $events: [ID]
    $registrations: [ID]
    $text: String
    $createPath: Any
  ) {
    enrolments(
      attendeeStatus: $attendeeStatus
      events: $events
      registrations: $registrations
      text: $text
    ) @rest(type: "Enrolment", pathBuilder: $createPath) {
      ...enrolmentFields
    }
  }
`;
