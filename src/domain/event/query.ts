// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_EVENT = gql`
  fragment externalLinkFields on ExternalLink {
    name
    link
  }

  fragment videoFields on Video {
    altText
    name
    url
  }

  fragment offerPriceGroupFields on OfferPriceGroup {
    id
    priceGroup {
      ...densePriceGroupFields
    }
    price
    vatPercentage
    priceWithoutVat
    vat
  }

  fragment offerFields on Offer {
    description {
      ...localisedFields
    }
    infoUrl {
      ...localisedFields
    }
    isFree
    offerPriceGroups {
      ...offerPriceGroupFields
    }
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
    deleted
    description {
      ...localisedFields
    }
    endTime
    enrolmentEndTime
    enrolmentStartTime
    environment
    environmentalCertificate
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
    maximumAttendeeCapacity
    minimumAttendeeCapacity
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
    registration {
      ...idObjectFields
    }
    shortDescription {
      ...localisedFields
    }
    startTime
    superEventType
    typeId
    userConsent
    userEmail
    userName
    userOrganization
    userPhoneNumber
    videos {
      ...videoFields
    }
  }

  fragment eventFields on Event {
    ...baseEventFields
    superEvent {
      ...baseEventFields
    }
    subEvents {
      ...baseEventFields
      subEvents {
        ...baseEventFields
      }
    }
  }

  query Event($id: ID!, $include: [String], $createPath: Any) {
    event(id: $id, include: $include)
      @rest(type: "Event", pathBuilder: $createPath) {
      ...eventFields
    }
  }
`;
