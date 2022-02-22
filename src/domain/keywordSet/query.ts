// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_KEYWORD_SET = gql`
  fragment keywordSetFields on KeywordSet {
    id
    atId
    dataSource
    keywords {
      ...keywordFields
    }
    name {
      ...localisedFields
    }
    organization
    usage
  }

  query KeywordSet($id: ID!, $include: [String], $createPath: Any) {
    keywordSet(id: $id, include: $include)
      @rest(type: "KeywordSet", pathBuilder: $createPath) {
      ...keywordSetFields
    }
  }

  query KeywordSets(
    $include: [String]
    $page: Int
    $pageSize: Int
    $sort: String
    $text: String
    $createPath: Any
  ) {
    keywordSets(
      include: $include
      page: $page
      pageSize: $pageSize
      sort: $sort
      text: $text
    ) @rest(type: "KeywordSetsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...keywordSetFields
      }
    }
  }
`;
