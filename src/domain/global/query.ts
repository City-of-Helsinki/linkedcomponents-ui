// eslint-disable-next-line import/no-named-as-default
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

  fragment idObjectFields on IdObject {
    atId
  }

  fragment metaFields on Meta {
    count
    next
    previous
  }
`;
