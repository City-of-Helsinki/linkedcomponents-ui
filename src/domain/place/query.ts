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

  query Place($id: ID!, $createPath: Any) {
    place(id: $id) @rest(type: "Place", pathBuilder: $createPath) {
      ...placeFields
    }
  }
  query Places(
    $dataSource: String
    $division: [String]
    $hasUpcomingEvents: Boolean
    $page: Int
    $pageSize: Int
    $showAllPlaces: Boolean
    $sort: String
    $text: String
    $createPath: Any
  ) {
    places(
      dataSource: $dataSource
      division: $division
      hasUpcomingEvents: $hasUpcomingEvents
      page: $page
      pageSize: $pageSize
      showAllPlaces: $showAllPlaces
      sort: $sort
      text: $text
    ) @rest(type: "PlacesResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...placeFields
      }
    }
  }
`;
