import gql from 'graphql-tag';

export const QUERY_EVENTS = gql`
  query Events(
    $adminUser: Boolean
    $createdBy: String
    $combinedText: [String]
    $division: [String]
    $end: String
    $endsAfter: String
    $endsBefore: String
    $eventType: [EventTypeId]
    $include: [String]
    $inLanguage: String
    $isFree: Boolean
    $keyword: [String]
    $keywordAnd: [String]
    $keywordNot: [String]
    $language: String
    $location: [String]
    $page: Int
    $pageSize: Int
    $publicationStatus: PublicationStatus
    $publisher: [String]
    $showAll: Boolean
    $sort: String
    $start: String
    $startsAfter: String
    $startsBefore: String
    $superEvent: ID
    $superEventType: [String]
    $text: String
    $translation: String
    $createPath: Any
  ) {
    events(
      adminUser: $adminUser
      createdBy: $createdBy
      combinedText: $combinedText
      division: $division
      end: $end
      endsAfter: $endsAfter
      endsBefore: $endsBefore
      eventType: $eventType
      include: $include
      inLanguage: $inLanguage
      isFree: $isFree
      keyword: $keyword
      keywordAnd: $keywordAnd
      keywordNot: $keywordNot
      language: $language
      location: $location
      page: $page
      pageSize: $pageSize
      publicationStatus: $publicationStatus
      publisher: $publisher
      showAll: $showAll
      sort: $sort
      start: $start
      startsAfter: $startsAfter
      startsBefore: $startsBefore
      superEvent: $superEvent
      superEventType: $superEventType
      text: $text
      translation: $translation
    ) @rest(type: "EventsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...eventFields
      }
    }
  }
`;
