// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_REGISTRATIONS = gql`
  query Registrations(
    $eventType: [EventTypeId]
    $page: Int
    $pageSize: Int
    $text: String
    $createPath: Any
  ) {
    registrations(
      eventType: $eventType
      page: $page
      pageSize: $pageSize
      text: $text
    ) @rest(type: "RegistrationsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...registrationFields
      }
    }
  }
`;
