// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SIGNUPS = gql`
  query Signups(
    $attendeeStatus: AttendeeStatus
    $registration: [ID]
    $text: String
    $createPath: Any
  ) {
    signups(
      attendeeStatus: $attendeeStatus
      registration: $registration
      text: $text
    ) @rest(type: "SignupsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...signupFields
      }
    }
  }
`;
