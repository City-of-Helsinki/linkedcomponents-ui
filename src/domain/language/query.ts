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

  query Languages($serviceLanguage: Boolean, $createPath: Any) {
    languages(serviceLanguage: $serviceLanguage)
      @rest(type: "LanguagesResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...languageFields
      }
    }
  }
`;
