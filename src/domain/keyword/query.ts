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
`;
