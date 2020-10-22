import gql from 'graphql-tag';

export const QUERY_LANGUAGE = gql`
  fragment languageFields on Language {
    id
    internalId
    name {
      ...localisedFields
    }
  }

  query Languages {
    languages
      @rest(type: "LanguagesResponse", path: "/language/", method: "GET") {
      meta {
        ...metaFields
      }
      data {
        ...languageFields
      }
    }
  }
`;
