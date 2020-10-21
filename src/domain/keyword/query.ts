import gql from 'graphql-tag';

export const QUERY_KEYWORD = gql`
  fragment keywordFields on Keyword {
    id
    dataSource
    hasUpcomingEvents
    internalId
    name {
      ...localisedFields
    }
  }
`;
