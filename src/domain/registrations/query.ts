// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_REGISTRATIONS = gql`
  query Registrations(
    $adminUser: Boolean
    $eventType: [EventTypeId]
    $include: [String]
    $page: Int
    $pageSize: Int
    $publisher: [String]
    $text: String
    $createPath: Any
  ) {
    registrations(
      adminUser: $adminUser
      eventType: $eventType
      include: $include
      page: $page
      pageSize: $pageSize
      publisher: $publisher
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
