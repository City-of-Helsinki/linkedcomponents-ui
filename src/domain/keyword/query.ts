import gql from 'graphql-tag';

export const QUERY_KEYWORD = gql`
  fragment keywordFields on Keyword {
    id
    atId
    dataSource
    hasUpcomingEvents
    name {
      ...localisedFields
    }
  }

  query Keyword($id: ID!, $createPath: Any) {
    keyword(id: $id) @rest(type: "Keyword", pathBuilder: $createPath) {
      ...keywordFields
    }
  }

  query Keywords(
    $dataSource: String
    $freeText: String
    $hasUpcomingEvents: Boolean
    $page: Int
    $pageSize: Int
    $showAllKeywords: Boolean
    $sort: String
    $text: String
    $createPath: Any
  ) {
    keywords(
      dataSource: $dataSource
      freeText: $freeText
      hasUpcomingEvents: $hasUpcomingEvents
      page: $page
      pageSize: $pageSize
      showAllKeywords: $showAllKeywords
      sort: $sort
      text: $text
    ) @rest(type: "KeywordsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...keywordFields
      }
    }
  }
`;
