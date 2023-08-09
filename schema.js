/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema } = require('graphql');

module.exports = buildSchema(/* GraphQL */ `
  scalar Any

  type Mutation {
    createEnrolment(
      input: CreateEnrolmentMutationInput!
    ): CreateEnrolmentResponse!
    createEvent(input: CreateEventMutationInput!): Event!
    createEvents(input: [CreateEventMutationInput!]!): [Event!]!
    createKeyword(input: CreateKeywordMutationInput!): Keyword!
    createKeywordSet(input: CreateKeywordSetMutationInput!): KeywordSet!
    createOrganization(input: CreateOrganizationMutationInput!): Organization!
    createPlace(input: CreatePlaceMutationInput!): Place!
    createRegistration(input: CreateRegistrationMutationInput!): Registration!
    createSeatsReservation(
      input: CreateSeatsReservationMutationInput!
    ): SeatsReservation!
    deleteEnrolment(signup: String!): NoContent
    deleteEvent(id: ID!): NoContent
    deleteImage(id: ID!): NoContent
    deleteKeyword(id: ID!): NoContent
    deleteKeywordSet(id: ID!): NoContent
    deleteOrganization(id: ID!): NoContent
    deletePlace(id: ID!): NoContent
    deleteRegistration(id: ID!): NoContent
    postFeedback(input: FeedbackInput!): Feedback
    postGuestFeedback(input: FeedbackInput!): Feedback
    sendMessage(
      input: SendMessageMutationInput!
      registration: String
    ): SendMessageResponse
    updateEnrolment(
      input: UpdateEnrolmentMutationInput!
      signup: String!
    ): Enrolment!
    updateEvent(input: UpdateEventMutationInput!): Event!
    updateEvents(input: [UpdateEventMutationInput!]!): [Event!]!
    updateImage(input: UpdateImageMutationInput!): Image!
    uploadImage(input: UploadImageMutationInput!): Image!
    updateKeyword(input: UpdateKeywordMutationInput!): Keyword!
    updateKeywordSet(input: UpdateKeywordSetMutationInput!): KeywordSet!
    updateOrganization(input: UpdateOrganizationMutationInput!): Organization!
    updatePlace(input: UpdatePlaceMutationInput!): Place!
    updateRegistration(input: UpdateRegistrationMutationInput!): Registration!
    updateSeatsReservation(
      id: ID!
      input: UpdateSeatsReservationMutationInput!
    ): SeatsReservation!
  }

  type NoContent {
    noContent: Boolean
  }

  type Query {
    dataSource(id: ID!): DataSource!
    dataSources(page: Int, pageSize: Int): DataSourcesResponse!
    enrolment(id: ID!): Enrolment!
    enrolments(
      attendeeStatus: AttendeeStatus
      registration: [ID]
      text: String
    ): EnrolmentsResponse!
    event(id: ID, include: [String]): Event!
    events(
      adminUser: Boolean
      createdBy: String
      combinedText: [String]
      division: [String]
      end: String
      endsAfter: String
      endsBefore: String
      eventType: [EventTypeId]
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
      registration: Boolean
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
    image(id: ID): Image!
    images(
      createdBy: String
      dataSource: String
      mergePages: Boolean
      page: Int
      pageSize: Int
      publisher: ID
      sort: String
      text: String
    ): ImagesResponse!
    keyword(id: ID!): Keyword!
    keywords(
      dataSource: [String]
      freeText: String
      hasUpcomingEvents: Boolean
      page: Int
      pageSize: Int
      showAllKeywords: Boolean
      sort: String
      text: String
    ): KeywordsResponse!
    keywordSet(id: ID!, include: [String]): KeywordSet
    keywordSets(
      include: [String]
      page: Int
      pageSize: Int
      sort: String
      text: String
    ): KeywordSetsResponse!
    languages(serviceLanguage: Boolean): LanguagesResponse!
    organization(id: ID!): Organization!
    organizations(
      child: ID
      page: Int
      pageSize: Int
      text: String
    ): OrganizationsResponse!
    organizationClass(id: ID!): OrganizationClass!
    organizationClasses(page: Int, pageSize: Int): OrganizationClassesResponse!
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
    registration(id: ID, include: [String]): Registration!
    registrations(
      adminUser: Boolean
      eventType: [EventTypeId]
      include: [String]
      page: Int
      pageSize: Int
      text: String
    ): RegistrationsResponse!
    user(id: ID!): User!
    users(page: Int, pageSize: Int): UsersResponse!
  }

  enum AttendeeStatus {
    attending
    waitlisted
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

  input FeedbackInput {
    name: String
    email: String
    subject: String
    body: String
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

  input SignupInput {
    city: String
    dateOfBirth: String
    email: String
    extraInfo: String
    firstName: String
    lastName: String
    membershipNumber: String
    nativeLanguage: String
    notifications: String
    phoneNumber: String
    serviceLanguage: String
    streetAddress: String
    zipcode: String
  }

  input CreateEnrolmentMutationInput {
    registration: String
    reservationCode: String
    signups: [SignupInput!]
  }

  input UpdateEnrolmentMutationInput {
    id: ID!
    city: String
    dateOfBirth: String
    email: String
    extraInfo: String
    firstName: String
    lastName: String
    membershipNumber: String
    nativeLanguage: String
    notifications: String
    phoneNumber: String
    registration: ID
    serviceLanguage: String
    streetAddress: String
    zipcode: String
  }

  input CreateEventMutationInput {
    audience: [IdObjectInput!]
    audienceMaxAge: Int
    audienceMinAge: Int
    description: LocalisedObjectInput
    endTime: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    environment: String
    environmentalCertificate: String
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
    userConsent: Boolean
    userEmail: String
    userName: String
    userOrganization: String
    userPhoneNumber: String
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
    environment: String
    environmentalCertificate: String
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
    userConsent: Boolean
    userEmail: String
    userName: String
    userOrganization: String
    userPhoneNumber: String
    videos: [VideoInput]
  }

  input UpdateImageMutationInput {
    altText: LocalisedObjectInput
    id: ID!
    license: String
    name: String!
    photographerName: String
    publisher: String
  }

  input UploadImageMutationInput {
    altText: LocalisedObjectInput
    image: Any
    license: String
    name: String!
    photographerName: String
    publisher: String
    url: String
  }

  input CreateKeywordMutationInput {
    dataSource: String
    deprecated: Boolean
    id: String
    name: LocalisedObjectInput
    publisher: String
    replacedBy: String
  }

  input UpdateKeywordMutationInput {
    dataSource: String
    deprecated: Boolean
    id: String
    name: LocalisedObjectInput
    publisher: String
    replacedBy: String
  }

  input CreateKeywordSetMutationInput {
    dataSource: String
    id: String
    keywords: [IdObjectInput!]
    name: LocalisedObjectInput
    organization: String
    usage: String
  }

  input UpdateKeywordSetMutationInput {
    dataSource: String
    id: String
    keywords: [IdObjectInput!]
    name: LocalisedObjectInput
    organization: String
    usage: String
  }

  input CreateOrganizationMutationInput {
    adminUsers: [String]
    affiliatedOrganizations: [String]
    classification: String
    dataSource: String
    dissolutionDate: String
    foundingDate: String
    id: String
    internalType: String
    name: String
    originId: String
    parentOrganization: String
    regularUsers: [String]
    replacedBy: String
    subOrganizations: [String]
  }

  input UpdateOrganizationMutationInput {
    adminUsers: [String]
    affiliatedOrganizations: [String]
    classification: String
    dataSource: String
    dissolutionDate: String
    foundingDate: String
    id: String
    internalType: String
    name: String
    parentOrganization: String
    regularUsers: [String]
    replacedBy: String
    subOrganizations: [String]
  }

  input CreatePlaceMutationInput {
    addressLocality: LocalisedObjectInput
    addressRegion: String
    contactType: String
    dataSource: String
    description: LocalisedObjectInput
    email: String
    id: String
    infoUrl: LocalisedObjectInput
    name: LocalisedObjectInput
    originId: String
    position: PositionInput
    postalCode: String
    postOfficeBoxNum: String
    publisher: String
    streetAddress: LocalisedObjectInput
    telephone: LocalisedObjectInput
  }

  input UpdatePlaceMutationInput {
    addressLocality: LocalisedObjectInput
    addressRegion: String
    contactType: String
    dataSource: String
    description: LocalisedObjectInput
    email: String
    id: String
    infoUrl: LocalisedObjectInput
    name: LocalisedObjectInput
    position: PositionInput
    postalCode: String
    postOfficeBoxNum: String
    publisher: String
    streetAddress: LocalisedObjectInput
    telephone: LocalisedObjectInput
  }

  input PositionInput {
    coordinates: [Float]!
    type: String
  }

  input CreateRegistrationMutationInput {
    audienceMaxAge: Int
    audienceMinAge: Int
    confirmationMessage: LocalisedObjectInput
    enrolmentEndTime: String
    enrolmentStartTime: String
    event: IdObjectInput!
    instructions: LocalisedObjectInput
    mandatoryFields: [String]
    maximumAttendeeCapacity: Int
    maximumGroupSize: Int
    minimumAttendeeCapacity: Int
    waitingListCapacity: Int
  }

  input UpdateRegistrationMutationInput {
    id: ID!
    audienceMaxAge: Int
    audienceMinAge: Int
    confirmationMessage: LocalisedObjectInput
    enrolmentEndTime: String
    enrolmentStartTime: String
    event: IdObjectInput!
    instructions: LocalisedObjectInput
    mandatoryFields: [String]
    maximumAttendeeCapacity: Int
    maximumGroupSize: Int
    minimumAttendeeCapacity: Int
    waitingListCapacity: Int
  }

  input CreateSeatsReservationMutationInput {
    registration: ID!
    seats: Int!
  }

  input UpdateSeatsReservationMutationInput {
    code: String!
    registration: ID!
    seats: Int!
  }

  input SendMessageMutationInput {
    body: String!
    signups: [String!]
    subject: String!
  }

  type DataSource {
    apiKey: String
    createPastEvents: Boolean
    editPastEvents: Boolean
    id: ID
    name: String
    owner: String
    private: Boolean
    userEditable: Boolean
    atContext: String
    atId: String!
    atType: String
  }

  type DataSourcesResponse {
    meta: Meta!
    data: [DataSource]!
  }

  type EventsResponse {
    meta: Meta!
    data: [Event]!
  }

  type Feedback {
    id: ID
    name: String
    email: String
    subject: String
    body: String
  }

  type IdObject {
    atId: String
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

  type UsersResponse {
    meta: Meta!
    data: [User]!
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
    environment: String
    environmentalCertificate: String
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
    registration: IdObject
    shortDescription: LocalisedObject
    startTime: String
    subEvents: [Event]!
    superEvent: Event
    superEventType: SuperEventType
    typeId: EventTypeId
    userConsent: Boolean
    userEmail: String
    userName: String
    userOrganization: String
    userPhoneNumber: String
    videos: [Video]!
    # @id is renamed as atId so it's usable on GraphQl
    atId: String!
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
    altText: LocalisedObject
    createdBy: String
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
    atId: String!
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
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
    replacedBy: String
    # @id is renamed as atId so it's usable on GraphQl
    atId: String!
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
    atId: String!
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type Language {
    id: ID
    serviceLanguage: Boolean
    translationAvailable: Boolean
    name: LocalisedObject
    # @id is renamed as atId so it's usable on GraphQl
    atId: String!
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
    adminUsers: [User]
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
    regularUsers: [User]
    replacedBy: String
    subOrganizations: [String]
    atContext: String
    atId: String!
    atType: String
  }

  type OrganizationsResponse {
    meta: Meta!
    data: [Organization]!
  }

  type OrganizationClass {
    createdTime: String
    dataSource: String
    id: String
    lastModifiedTime: String
    name: String
    atContext: String
    atId: String!
    atType: String
  }

  type OrganizationClassesResponse {
    meta: Meta!
    data: [OrganizationClass]!
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
    description: LocalisedObject
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
    atId: String!
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

  type RegistrationsResponse {
    meta: Meta!
    data: [Registration]!
  }

  type Registration {
    id: ID
    attendeeRegistration: Boolean
    audienceMaxAge: Int
    audienceMinAge: Int
    confirmationMessage: LocalisedObject
    createdAt: String
    createdBy: String
    currentAttendeeCount: Int
    currentWaitingListCount: Int
    dataSource: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    event: Event
    instructions: LocalisedObject
    lastModifiedAt: String
    lastModifiedBy: String
    mandatoryFields: [String]
    maximumAttendeeCapacity: Int
    maximumGroupSize: Int
    minimumAttendeeCapacity: Int
    remainingAttendeeCapacity: Int
    remainingWaitingListCapacity: Int
    publisher: String
    signups: [Enrolment]
    waitingListCapacity: Int
    # @id is renamed as atId so it's usable on GraphQl
    atId: String!
    # @context is renamed as atContext so it's usable on GraphQl
    atContext: String
    # @type is renamed as atType so it's usable on GraphQl
    atType: String
  }

  type SeatsReservation {
    id: ID!
    code: String!
    expiration: String!
    inWaitlist: Boolean!
    registration: ID!
    seats: Int!
    timestamp: String!
  }

  type EnrolmentPeopleResponse {
    count: Int
    people: [Enrolment!]
  }

  type CreateEnrolmentResponse {
    attending: EnrolmentPeopleResponse
    waitlisted: EnrolmentPeopleResponse
  }

  type Enrolment {
    id: ID!
    attendeeStatus: AttendeeStatus
    cancellationCode: String
    city: String
    dateOfBirth: String
    email: String
    extraInfo: String
    firstName: String
    lastName: String
    membershipNumber: String
    nativeLanguage: String
    notifications: String
    phoneNumber: String
    registration: ID
    serviceLanguage: String
    streetAddress: String
    zipcode: String
  }

  type EnrolmentsResponse {
    meta: Meta!
    data: [Enrolment!]!
  }

  type SendMessageResponse {
    htmlMessage: String!
    message: String!
    signups: [String!]
    subject: String!
  }
`);
