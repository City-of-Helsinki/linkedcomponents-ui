// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENTS = gql`
  query Enrolments(
    $page: Int
    $pageSize: Int
    $registration: ID
    $text: String
    $createPath: Any
  ) {
    enrolments(
      page: $page
      pageSize: $pageSize
      registration: $registration
      text: $text
    ) @rest(type: "EnrolmentsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...enrolmentFields
      }
    }
  }
`;
