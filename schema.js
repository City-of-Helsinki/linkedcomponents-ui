/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema } = require('graphql');

module.exports = buildSchema(/* GraphQL */ `
  scalar Any

  type Query {
    event(id: ID, include: [String]): Event!
    events(
      combinedText: [String]
      division: [String]
      end: String
      endsAfter: String
      endsBefore: String
      inLanguage: String
      include: [String]
      isFree: Boolean
      keyword: [String]
      keywordAnd: [String]
      keywordNot: [String]
      language: String
      location: [String]
      page: Int
      pageSize: Int
      publisher: ID
      sort: String
      start: String
      startsAfter: String
      startsBefore: String
      superEvent: ID
      superEventType: [String]
      text: String
      translation: String
    ): EventsResponse!
    languages: LanguagesResponse!
  }

  type EventsResponse {
    meta: Meta!
    data: [Event]!
  }

  type LanguagesResponse {
    meta: Meta!
    data: [Language]!
  }

  type Meta {
    count: Int!
    next: String
    previous: String
  }

  type Division {
    municipality: String
    name: LocalisedObject
    ocdId: String
    type: String
  }

  type Event {
    id: ID!
    audience: [InternalIdObject]!
    audienceMaxAge: String
    audienceMinAge: String
    createdTime: String
    customData: String
    dataSource: String
    datePublished: String
    description: LocalisedObject
    endTime: String
    extensionCourse: ExtensionCourse
    externalLinks: [ExternalLink]!
    eventStatus: String
    images: [Image]!
    infoUrl: LocalisedObject
    inLanguage: [Language]!
    keywords: [Keyword]!
    lastModifiedTime: String
    location: Place
    locationExtraInfo: LocalisedObject
    name: LocalisedObject
    offers: [Offer]!
    provider: LocalisedObject
    providerContactInfo: String
    publisher: ID
    shortDescription: LocalisedObject
    startTime: String
    subEvents: [InternalIdObject]!
    superEvent: InternalIdObject
    superEventType: String
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
    # @context is renamed as internalContext so it's usable on GraphQl
    internalContext: String
    # @type is renamed as internalType so it's usable on GraphQl
    internalType: String
  }

  type ExternalLink {
    name: String
    link: String
    language: String
  }

  type ExtensionCourse {
    enrolmentStartTime: String
    enrolmentEndTime: String
    maximumAttendeeCapacity: Int
    minimumAttendeeCapacity: Int
    remainingAttendeeCapacity: Int
  }

  type Image {
    id: ID
    createdTime: String
    cropping: String
    dataSource: String
    lastModifiedTime: String
    license: String
    name: String
    photographerName: String
    publisher: String
    url: String
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
    # @context is renamed as internalContext so it's usable on GraphQl
    internalContext: String
    # @type is renamed as internalType so it's usable on GraphQl
    internalType: String
  }

  type InternalIdObject {
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
  }

  type Keyword {
    id: ID
    aggregate: Boolean
    altLabels: [String]
    createdTime: String
    dataSource: String
    deprecated: Boolean
    hasUpcomingEvents: Boolean
    image: Image
    lastModifiedTime: String
    name: LocalisedObject
    nEvents: Int
    publisher: ID
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
    # @context is renamed as internalContext so it's usable on GraphQl
    internalContext: String
    # @type is renamed as internalType so it's usable on GraphQl
    internalType: String
  }

  type Language {
    id: ID
    translationAvailable: Boolean
    name: LocalisedObject
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
    # @context is renamed as internalContext so it's usable on GraphQl
    internalContext: String
    # @type is renamed as internalType so it's usable on GraphQl
    internalType: String
  }

  type LocalisedObject {
    fi: String
    sv: String
    en: String
  }

  type Offer {
    description: LocalisedObject
    infoUrl: LocalisedObject
    isFree: Boolean
    price: LocalisedObject
  }

  type Place {
    id: ID
    addressCountry: String
    addressLocality: LocalisedObject
    addressRegion: String
    contactType: String
    createdTime: String
    customData: String
    dataSource: String
    deleted: Boolean
    description: String
    divisions: [Division]!
    email: String
    hasUpcomingEvents: Boolean
    image: Image
    infoUrl: LocalisedObject
    lastModifiedTime: String
    name: LocalisedObject
    nEvents: Int
    parent: ID
    position: Position
    postalCode: String
    postOfficeBoxNum: String
    publisher: ID
    replacedBy: String
    streetAddress: LocalisedObject
    telephone: LocalisedObject
    # @id is renamed as internalId so it's usable on GraphQl
    internalId: String
    # @context is renamed as internalContext so it's usable on GraphQl
    internalContext: String
    # @type is renamed as internalType so it's usable on GraphQl
    internalType: String
  }

  type Position {
    coordinates: [Float]!
    type: String
  }
`);
