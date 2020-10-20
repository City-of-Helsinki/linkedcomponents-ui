import gql from 'graphql-tag';

export const QUERY_GLOBAL = gql`
  fragment localisedFields on LocalisedObject {
    en
    fi
    sv
  }

  fragment metaFields on Meta {
    count
    next
    previous
  }
`;
