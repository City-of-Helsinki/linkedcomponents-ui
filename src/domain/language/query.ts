// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_LANGUAGE = gql`
  fragment languageFields on Language {
    id
    atId
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
