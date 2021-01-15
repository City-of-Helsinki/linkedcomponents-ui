import gql from 'graphql-tag';

export const QUERY_EVENT = gql`
  fragment externalLinkFields on ExternalLink {
    name
    link
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

  fragment baseEventFields on Event {
    id
    atId
    audience {
      ...keywordFields
    }
    audienceMaxAge
    audienceMinAge
    createdBy
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
    lastModifiedTime
    location {
      ...placeFields
    }
    locationExtraInfo {
      ...localisedFields
    }
    name {
      ...localisedFields
    }
    offers {
      ...offerFields
    }
    publicationStatus
    provider {
      ...localisedFields
    }
    publisher
    shortDescription {
      ...localisedFields
    }
    startTime
    superEventType
  }

  fragment eventFields on Event {
    ...baseEventFields
    superEvent {
      ...baseEventFields
    }
  }

  query Event($id: ID!, $include: [String], $createPath: Any) {
    event(id: $id, include: $include)
      @rest(type: "Event", pathBuilder: $createPath) {
      ...eventFields
    }
  }
`;
