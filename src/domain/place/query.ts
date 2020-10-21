import gql from 'graphql-tag';

export const QUERY_PLACE = gql`
  fragment divisionFields on Division {
    type
    name {
      ...localisedFields
    }
  }

  fragment positionFields on Position {
    coordinates
  }

  fragment placeFields on Place {
    id
    addressLocality {
      ...localisedFields
    }
    divisions {
      ...divisionFields
    }
    email
    hasUpcomingEvents
    infoUrl {
      ...localisedFields
    }
    internalId

    name {
      ...localisedFields
    }
    postalCode
    streetAddress {
      ...localisedFields
    }
    telephone {
      ...localisedFields
    }
    position {
      ...positionFields
    }
  }
`;
