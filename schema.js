/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema } = require('graphql');

module.exports = buildSchema(/* GraphQL */ `
  scalar Any

  type Mutation {
    createEvent(input: CreateEventMutationInput!): Event!
    createEvents(input: [CreateEventMutationInput!]!): [Event!]!
    deleteEvent(id: ID!): NoContent
    updateEvent(input: UpdateEventMutationInput!): Event!
    updateEvents(input: [UpdateEventMutationInput!]!): [Event!]!
    updateImage(input: UpdateImageMutationInput!): Image!
    uploadImage(input: UploadImageMutationInput!): Image!
  }

  type NoContent {
    noContent: Boolean
  }

  type Query {
    event(id: ID, include: [String]): Event!
    events(
      adminUser: Boolean
      createdBy: String
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
      publicationStatus: PublicationStatus
      publisher: [String]
      showAll: Boolean
      sort: String
      start: String
      startsAfter: String
      startsBefore: String
      superEvent: ID
      superEventType: [String]
      text: String
      translation: String
    ): EventsResponse!
    keyword(id: ID!): Keyword!
    keywords(
      dataSource: String
      freeText: String
      hasUpcomingEvents: Boolean
      page: Int
      pageSize: Int
      showAllKeywords: Boolean
      sort: String
      text: String
    ): KeywordsResponse!
    keywordSet(id: ID!, include: [String]): KeywordSet
    keywordSets(include: [String]): KeywordSetsResponse!
    languages: LanguagesResponse!
    image(id: ID): Image!
    images(
      dataSource: String
      page: Int
      pageSize: Int
      publisher: ID
    ): ImagesResponse!
    organization(id: ID!): Organization!
    organizations(child: ID, page: Int, pageSize: Int): OrganizationsResponse!
    place(id: ID!): Place!
    places(
      dataSource: String
      division: [String]
      hasUpcomingEvents: Boolean
      page: Int
      pageSize: Int
      showAllPlaces: Boolean
      sort: String
      text: String
    ): PlacesResponse!
    user(id: ID!): User!
  }

  enum EventStatus {
    EventCancelled
    EventPostponed
    EventRescheduled
    EventScheduled
  }

  enum PublicationStatus {
    draft
    public
  }

  enum SuperEventType {
    recurring
    umbrella
  }

  enum EventTypeId {
    General
    Course
    Volunteering
  }

  input ExternalLinkInput {
    name: String
    link: String
    language: String
  }

  input IdObjectInput {
    atId: String!
  }

  input LocalisedObjectInput {
    ar: String
    en: String
    fi: String
    ru: String
    sv: String
    zhHans: String
  }

  input OfferInput {
    description: LocalisedObjectInput
    infoUrl: LocalisedObjectInput
    isFree: Boolean
    price: LocalisedObjectInput
  }

  input VideoInput {
    altText: String
    name: String
    url: String
  }

  input CreateEventMutationInput {
    audience: [IdObjectInput!]
    audienceMaxAge: Int
    audienceMinAge: Int
    description: LocalisedObjectInput
    endTime: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    eventStatus: EventStatus
    externalLinks: [ExternalLinkInput]
    images: [IdObjectInput!]
    inLanguage: [IdObjectInput!]
    infoUrl: LocalisedObjectInput
    keywords: [IdObjectInput!]
    location: IdObjectInput
    locationExtraInfo: LocalisedObjectInput
    maximumAttendeeCapacity: Int
    minimumAttendeeCapacity: Int
    name: LocalisedObjectInput
    offers: [OfferInput!]
    provider: LocalisedObjectInput
    publicationStatus: PublicationStatus
    publisher: String
    shortDescription: LocalisedObjectInput
    startTime: String
    subEvents: [IdObjectInput!]
    superEvent: IdObjectInput
    superEventType: SuperEventType
    typeId: EventTypeId
    videos: [VideoInput]
  }

  input UpdateEventMutationInput {
    id: ID!
    audience: [IdObjectInput!]
    audienceMaxAge: Int
    audienceMinAge: Int
    description: LocalisedObjectInput
    endTime: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    eventStatus: EventStatus
    externalLinks: [ExternalLinkInput]
    images: [IdObjectInput!]
    inLanguage: [IdObjectInput!]
    infoUrl: LocalisedObjectInput
    keywords: [IdObjectInput!]
    location: IdObjectInput
    locationExtraInfo: LocalisedObjectInput
    maximumAttendeeCapacity: Int
    minimumAttendeeCapacity: Int
    name: LocalisedObjectInput
    offers: [OfferInput!]
    provider: LocalisedObjectInput
    publicationStatus: PublicationStatus
    shortDescription: LocalisedObjectInput
    startTime: String
    subEvents: [IdObjectInput!]
    superEvent: IdObjectInput
    superEventType: SuperEventType
    typeId: EventTypeId
    videos: [VideoInput]
  }

  input UpdateImageMutationInput {
    altText: String
    id: ID!
    license: String
    name: String!
    photographerName: String
  }

  input UploadImageMutationInput {
    altText: String
    image: Any
    license: String
    name: String!
    photographerName: String
    publisher: String
    url: String
  }

  type EventsResponse {
    meta: Meta!
    data: [Event]!
  }

  type ImagesResponse {
    meta: Meta!
    data: [Image]!
  }

  type KeywordsResponse {
    meta: Meta!
    data: [Keyword]!
  }

  type KeywordSetsResponse {
    meta: Meta!
    data: [KeywordSet]!
  }

  type LanguagesResponse {
    meta: Meta!
    data: [Language]!
  }

  type PlacesResponse {
    meta: Meta!
    data: [Place]!
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
    audience: [Keyword]!
    audienceMaxAge: Int
    audienceMinAge: Int
    createdBy: String
    createdTime: String
    customData: String
    dataSource: String
    datePublished: String
    deleted: String
    description: LocalisedObject
    endTime: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    extensionCourse: ExtensionCourse
    externalLinks: [ExternalLink]!
    eventStatus: EventStatus
    images: [Image]!
    infoUrl: LocalisedObject
    inLanguage: [Language]!
    keywords: [Keyword]!
    lastModifiedTime: String
    location: Place
    locationExtraInfo: LocalisedObject
    maximumAttendeeCapacity: Int
    minimumAttendeeCapacity: Int
    name: LocalisedObject
    offers: [Offer]!
    provider: LocalisedObject
    providerContactInfo: String
    publisher: ID
    publicationStatus: PublicationStatus
    shortDescription: LocalisedObject
    startTime: String
    subEvents: [Event]!
    superEvent: Event
    superEventType: SuperEventType
    typeId: EventTypeId
    videos: [Video]!
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
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
    altText: String
    createdTime: String
    cropping: String
    dataSource: String
    lastModifiedTime: String
    license: String
    name: String
    photographerName: String
    publisher: String
    url: String
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type AtIdObject {
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
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
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type KeywordSet {
    id: ID
    keywords: [Keyword]
    usage: String
    createdTime: String
    lastModifiedTime: String
    image: Image
    dataSource: String
    organization: String
    name: LocalisedObject
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type Language {
    id: ID
    translationAvailable: Boolean
    name: LocalisedObject
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type LocalisedObject {
    ar: String
    en: String
    fi: String
    ru: String
    sv: String
    zhHans: String
  }

  type Offer {
    description: LocalisedObject
    infoUrl: LocalisedObject
    isFree: Boolean
    price: LocalisedObject
  }

  type Organization {
    affiliatedOrganizations: [String]
    classification: String
    createdTime: String
    dataSource: String
    dissolutionDate: String
    foundingDate: String
    hasRegularUsers: Boolean
    id: String
    isAffiliated: Boolean
    lastModifiedTime: String
    name: String
    parentOrganization: String
    replacedBy: String
    subOrganizations: [String]
    atContext: String
    atId: String
    atType: String
  }

  type OrganizationsResponse {
    meta: Meta!
    data: [Organization]!
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
    # @id is renamed as atId so it's usable on GraphQl
    atId: String
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type Position {
    coordinates: [Float]!
    type: String
  }

  type User {
    adminOrganizations: [String!]!
    dateJoined: String
    departmentName: String
    displayName: String
    email: String
    firstName: String
    isStaff: Boolean
    lastLogin: String
    lastName: String
    organization: String
    organizationMemberships: [String!]!
    username: String
    uuid: String
  }

  type Video {
    altText: String
    name: String
    url: String
  }
`);
