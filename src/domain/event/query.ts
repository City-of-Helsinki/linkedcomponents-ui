import gql from 'graphql-tag';

export const QUERY_EVENT_DETAILS = gql`
  fragment externalLinkFields on ExternalLink {
    name
    link
  }

  fragment imageFields on Image {
    id
    name
    url
  }

  fragment offerFields on Offer {
    description {
      ...localisedFields
    }
    infoUrl {
      ...localisedFields
    }
    isFree
    price {
      ...localisedFields
    }
  }

  fragment eventFields on Event {
    id
    atId
    description {
      ...localisedFields
    }
    endTime
    externalLinks {
      ...externalLinkFields
    }
    eventStatus
    images {
      ...imageFields
    }
    infoUrl {
      ...localisedFields
    }
    inLanguage {
      ...languageFields
    }
    keywords {
      ...keywordFields
    }
    location {
      ...placeFields
    }
    name {
      ...localisedFields
    }
    offers {
      ...offerFields
    }
    provider {
      ...localisedFields
    }
    publisher
    shortDescription {
      ...localisedFields
    }
    superEvent {
      atId
    }
    startTime
  }

  query Event($id: ID!, $include: [String], $createPath: Any) {
    event(id: $id, include: $include)
      @rest(type: "Event", pathBuilder: $createPath) {
      ...eventFields
    }
  }
`;
