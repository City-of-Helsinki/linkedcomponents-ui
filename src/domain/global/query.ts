import gql from 'graphql-tag';

export const QUERY_GLOBAL = gql`
  fragment localisedFields on LocalisedObject {
    ar
    en
    fi
    ru
    sv
    zhHans
  }

  fragment metaFields on Meta {
    count
    next
    previous
  }
`;
