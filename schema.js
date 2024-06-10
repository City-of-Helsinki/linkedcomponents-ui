/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema } = require('graphql');

module.exports = buildSchema(/* GraphQL */ `
  scalar Any

  type Mutation {
    createEvent(input: CreateEventMutationInput!): Event!
    createEvents(input: [CreateEventMutationInput!]!): [Event!]!
    createKeyword(input: CreateKeywordMutationInput!): Keyword!
    createKeywordSet(input: CreateKeywordSetMutationInput!): KeywordSet!
    createOrganization(input: CreateOrganizationMutationInput!): Organization!
    createPlace(input: CreatePlaceMutationInput!): Place!
    createPriceGroup(input: CreatePriceGroupMutationInput!): PriceGroup!
    createRegistration(input: CreateRegistrationMutationInput!): Registration!
    createSeatsReservation(
      input: CreateSeatsReservationMutationInput!
    ): SeatsReservation!
    createSignupGroup(
      input: CreateSignupGroupMutationInput!
    ): CreateSignupGroupResponse!
    createSignups(input: CreateSignupsMutationInput!): [Signup!]!
    deleteEvent(id: ID!): NoContent
    deleteImage(id: ID!): NoContent
    deleteKeyword(id: ID!): NoContent
    deleteKeywordSet(id: ID!): NoContent
    deleteOrganization(id: ID!): NoContent
    deletePlace(id: ID!): NoContent
    deletePriceGroup(id: Int!): NoContent
    deleteRegistration(id: ID!): NoContent
    deleteSignup(id: ID!): NoContent
    deleteSignupGroup(id: ID!): NoContent
    patchOrganization(
      id: ID!
      input: UpdateOrganizationMutationInput!
    ): Organization!
    postFeedback(input: FeedbackInput!): Feedback
    postGuestFeedback(input: FeedbackInput!): Feedback
    sendMessage(
      input: SendMessageMutationInput!
      registration: ID
    ): SendMessageResponse
    sendRegistrationUserAccessInvitation(id: Int): NoContent
    updateEvent(id: ID!, input: UpdateEventMutationInput!): Event!
    updateEvents(input: [UpdateEventMutationInput!]!): [Event!]!
    updateImage(id: ID!, input: UpdateImageMutationInput!): Image!
    uploadImage(input: UploadImageMutationInput!): Image!
    updateKeyword(id: ID!, input: UpdateKeywordMutationInput!): Keyword!
    updateKeywordSet(
      id: ID!
      input: UpdateKeywordSetMutationInput!
    ): KeywordSet!
    updateOrganization(
      id: ID!
      input: UpdateOrganizationMutationInput!
    ): Organization!
    updatePlace(id: ID!, input: UpdatePlaceMutationInput!): Place!
    updatePriceGroup(
      id: Int!
      input: UpdatePriceGroupMutationInput!
    ): PriceGroup!
    updateRegistration(
      id: ID!
      input: UpdateRegistrationMutationInput!
    ): Registration!
    updateSeatsReservation(
      id: ID!
      input: UpdateSeatsReservationMutationInput!
    ): SeatsReservation!
    updateSignup(id: ID!, input: UpdateSignupMutationInput!): Signup!
    updateSignupGroup(
      id: ID!
      input: UpdateSignupGroupMutationInput!
    ): SignupGroup!
  }

  type NoContent {
    noContent: Boolean
  }

  type Query {
    dataSource(id: ID!): DataSource!
    dataSources(page: Int, pageSize: Int): DataSourcesResponse!
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
      registrationAdminUser: Boolean
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
    organization(id: ID!, dissolved: Boolean): Organization!
    organizationAccounts(id: ID!): [WebStoreAccount!]!
    organizationMerchants(id: ID!): [WebStoreMerchant!]!
    organizations(
      child: ID
      page: Int
      pageSize: Int
      dissolved: Boolean
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
    priceGroup(id: ID!): PriceGroup!
    priceGroups(
      description: String
      isFree: Boolean
      page: Int
      pageSize: Int
      publisher: [String]
      sort: String
    ): PriceGroupsResponse!
    registration(id: ID, include: [String]): Registration!
    registrations(
      adminUser: Boolean
      eventType: [EventTypeId]
      include: [String]
      page: Int
      pageSize: Int
      publisher: [String]
      text: String
    ): RegistrationsResponse!
    signup(id: ID!): Signup!
    signups(
      attendeeStatus: AttendeeStatus
      page: Int
      pageSize: Int
      registration: [ID]
      text: String
    ): SignupsResponse!
    signupGroup(id: ID!): SignupGroup!
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

  enum PresenceStatus {
    not_present
    present
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

  input OfferPriceGroupInput {
    id: Int
    price: String
    priceGroup: Int
    vatPercentage: String
  }

  input OfferInput {
    description: LocalisedObjectInput
    infoUrl: LocalisedObjectInput
    isFree: Boolean
    offerPriceGroups: [OfferPriceGroupInput]
    price: LocalisedObjectInput
  }

  input VideoInput {
    altText: String
    name: String
    url: String
  }

  input ContactPersonInput {
    email: String
    firstName: String
    id: ID
    lastName: String
    membershipNumber: String
    nativeLanguage: String
    notifications: String
    phoneNumber: String
    serviceLanguage: String
  }

  input SignupPriceGroupInput {
    registrationPriceGroup: ID
  }

  input SignupInput {
    city: String
    contactPerson: ContactPersonInput
    createPayment: Boolean
    dateOfBirth: String
    extraInfo: String
    firstName: String
    id: ID
    lastName: String
    phoneNumber: String
    priceGroup: SignupPriceGroupInput
    presenceStatus: PresenceStatus
    streetAddress: String
    zipcode: String
  }

  input CreateSignupsMutationInput {
    registration: ID
    reservationCode: String
    signups: [SignupInput!]
  }

  input CreateSignupGroupMutationInput {
    contactPerson: ContactPersonInput
    createPayment: Boolean
    extraInfo: String
    registration: ID
    reservationCode: String
    signups: [SignupInput!]
  }

  input UpdateSignupGroupMutationInput {
    contactPerson: ContactPersonInput
    extraInfo: String
    registration: ID
    signups: [SignupInput!]
  }

  input UpdateSignupMutationInput {
    id: ID!
    city: String
    contactPerson: ContactPersonInput
    dateOfBirth: String
    extraInfo: String
    firstName: String
    lastName: String
    phoneNumber: String
    presenceStatus: PresenceStatus
    registration: ID
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
    altText: String
    license: String
    name: String!
    photographerName: String
    publisher: String
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
    keywords: [IdObjectInput!]
    name: LocalisedObjectInput
    organization: String
    usage: String
  }

  input WebStoreAccountInput {
    active: Boolean
    balanceProfitCenter: String
    companyCode: String
    id: Int
    internalOrder: String
    mainLedgerAccount: String
    name: String
    operationArea: String
    profitCenter: String
    project: String
  }

  input WebStoreMerchantInput {
    active: Boolean
    businessId: String
    city: String
    email: String
    id: Int
    name: String
    paytrailMerchantId: String
    phoneNumber: String
    streetAddress: String
    termsOfServiceUrl: String
    zipcode: String
  }

  input CreateOrganizationMutationInput {
    adminUsers: [String]
    affiliatedOrganizations: [String]
    classification: String
    dataSource: String
    dissolutionDate: String
    financialAdminUsers: [String]
    foundingDate: String
    id: String
    internalType: String
    name: String
    originId: String
    parentOrganization: String
    registrationAdminUsers: [String]
    regularUsers: [String]
    replacedBy: String
    subOrganizations: [String]
    webStoreAccounts: [WebStoreAccountInput]
    webStoreMerchants: [WebStoreMerchantInput]
  }

  input UpdateOrganizationMutationInput {
    adminUsers: [String]
    affiliatedOrganizations: [String]
    classification: String
    dataSource: String
    dissolutionDate: String
    financialAdminUsers: [String]
    foundingDate: String
    id: String
    internalType: String
    name: String
    parentOrganization: String
    registrationAdminUsers: [String]
    regularUsers: [String]
    replacedBy: String
    subOrganizations: [String]
    webStoreAccounts: [WebStoreAccountInput]
    webStoreMerchants: [WebStoreMerchantInput]
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
    infoUrl: LocalisedObjectInput
    name: LocalisedObjectInput
    position: PositionInput
    postalCode: String
    postOfficeBoxNum: String
    publisher: String
    streetAddress: LocalisedObjectInput
    telephone: LocalisedObjectInput
  }

  input CreatePriceGroupMutationInput {
    description: LocalisedObjectInput
    id: Int
    isFree: Boolean
    publisher: String
  }

  input UpdatePriceGroupMutationInput {
    description: LocalisedObjectInput
    isFree: Boolean
    publisher: String
  }

  input PositionInput {
    coordinates: [Float]!
    type: String
  }

  input RegistrationPriceGroupInput {
    id: Int
    price: String
    priceGroup: Int
    vatPercentage: String
  }

  input RegistrationUserAccessInput {
    email: String
    id: Int
    isSubstituteUser: Boolean
    language: String
  }

  input RegistrationAccountInput {
    account: Int
    balanceProfitCenter: String
    companyCode: String
    internalOrder: String
    mainLedgerAccount: String
    operationArea: String
    profitCenter: String
    project: String
  }

  input RegistrationMerchantInput {
    merchant: Int
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
    registrationAccount: RegistrationAccountInput
    registrationMerchant: RegistrationMerchantInput
    registrationPriceGroups: [RegistrationPriceGroupInput]
    registrationUserAccesses: [RegistrationUserAccessInput]
    waitingListCapacity: Int
  }

  input UpdateRegistrationMutationInput {
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
    registrationAccount: RegistrationAccountInput
    registrationMerchant: RegistrationMerchantInput
    registrationPriceGroups: [RegistrationPriceGroupInput]
    registrationUserAccesses: [RegistrationUserAccessInput]
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
    signupGroups: [String!]
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

  type Image {
    id: ID
    altText: String
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

  type OfferPriceGroup {
    id: Int
    priceGroup: PriceGroupDense
    price: String
    vatPercentage: String
    priceWithoutVat: String
    vat: String
  }

  type Offer {
    description: LocalisedObject
    infoUrl: LocalisedObject
    isFree: Boolean
    offerPriceGroups: [OfferPriceGroup]
    price: LocalisedObject
  }

  type WebStoreAccount {
    active: Boolean
    balanceProfitCenter: String
    companyCode: String
    createdBy: String
    createdTime: String
    id: Int
    internalOrder: String
    lastModifiedBy: String
    lastModifiedTime: String
    mainLedgerAccount: String
    name: String
    operationArea: String
    profitCenter: String
    project: String
  }

  type WebStoreMerchant {
    active: Boolean
    businessId: String
    city: String
    createdBy: String
    createdTime: String
    email: String
    id: Int
    lastModifiedBy: String
    lastModifiedTime: String
    merchantId: String
    name: String
    paytrailMerchantId: String
    phoneNumber: String
    streetAddress: String
    termsOfServiceUrl: String
    zipcode: String
  }

  type Organization {
    adminUsers: [User]
    affiliatedOrganizations: [String]
    classification: String
    createdTime: String
    dataSource: String
    dissolutionDate: String
    financialAdminUsers: [User]
    foundingDate: String
    hasRegularUsers: Boolean
    id: String
    isAffiliated: Boolean
    lastModifiedTime: String
    name: String
    parentOrganization: String
    registrationAdminUsers: [User]
    regularUsers: [User]
    replacedBy: String
    subOrganizations: [String]
    webStoreAccounts: [WebStoreAccount]
    webStoreMerchants: [WebStoreMerchant]
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
    financialAdminOrganizations: [String!]!
    firstName: String
    isExternal: Boolean
    isStaff: Boolean
    isSubstituteUser: Boolean
    isSuperuser: Boolean
    lastLogin: String
    lastName: String
    organization: String
    organizationMemberships: [String!]!
    registrationAdminOrganizations: [String!]!
    username: String
    uuid: String
  }

  type Video {
    altText: String
    name: String
    url: String
  }

  type PriceGroup {
    id: Int!
    createdBy: String
    createdTime: String
    description: LocalisedObject
    isFree: Boolean
    lastModifiedBy: String
    lastModifiedTime: String
    publisher: String
  }

  type PriceGroupsResponse {
    meta: Meta!
    data: [PriceGroup]!
  }

  type PriceGroupDense {
    id: Int!
    description: LocalisedObject
  }

  type RegistrationAccount {
    account: Int
    balanceProfitCenter: String
    companyCode: String
    internalOrder: String
    mainLedgerAccount: String
    operationArea: String
    profitCenter: String
    project: String
  }

  type RegistrationMerchant {
    merchant: Int
  }

  type RegistrationPriceGroup {
    id: Int
    priceGroup: PriceGroupDense
    price: String
    vatPercentage: String
    priceWithoutVat: String
    vat: String
  }

  type RegistrationUserAccess {
    email: String
    id: Int
    isSubstituteUser: Boolean
    language: String
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
    createdBy: String
    createdTime: String
    currentAttendeeCount: Int
    currentWaitingListCount: Int
    dataSource: String
    enrolmentEndTime: String
    enrolmentStartTime: String
    event: Event
    hasRegistrationUserAccess: Boolean
    hasSubstituteUserAccess: Boolean
    instructions: LocalisedObject
    isCreatedByCurrentUser: Boolean
    lastModifiedBy: String
    lastModifiedTime: String
    mandatoryFields: [String]
    maximumAttendeeCapacity: Int
    maximumGroupSize: Int
    minimumAttendeeCapacity: Int
    publisher: String
    registrationAccount: RegistrationAccount
    registrationMerchant: RegistrationMerchant
    registrationPriceGroups: [RegistrationPriceGroup]
    registrationUserAccesses: [RegistrationUserAccess]
    remainingAttendeeCapacity: Int
    remainingWaitingListCapacity: Int
    signups: [Signup]
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

  type CreateSignupGroupResponse {
    extraInfo: String
    id: ID
    registration: ID
    signups: [Signup!]
  }

  type ContactPerson {
    email: String
    firstName: String
    id: ID!
    lastName: String
    membershipNumber: String
    nativeLanguage: String
    notifications: String
    phoneNumber: String
    serviceLanguage: String
  }

  type PaymentCancellation {
    createdTime: String
    id: Int
    payment: Int
  }

  type PaymentRefund {
    amount: String
    createdTime: String
    externalRefundId: String
    id: Int
    payment: Int
  }

  type SignupPriceGroup {
    id: Int
    priceGroup: PriceGroupDense
    price: String
    registrationPriceGroup: Int
    vatPercentage: String
    priceWithoutVat: String
    vat: String
  }

  type Signup {
    attendeeStatus: AttendeeStatus
    city: String
    contactPerson: ContactPerson
    createdBy: String
    createdTime: String
    dateOfBirth: String
    extraInfo: String
    firstName: String
    id: ID!
    lastModifiedBy: String
    lastModifiedTime: String
    lastName: String
    paymentCancellation: PaymentCancellation
    paymentRefund: PaymentRefund
    phoneNumber: String
    priceGroup: SignupPriceGroup
    presenceStatus: PresenceStatus
    registration: ID
    signupGroup: ID
    streetAddress: String
    zipcode: String
  }

  type SignupGroup {
    contactPerson: ContactPerson
    createdBy: String
    createdTime: String
    extraInfo: String
    id: ID
    lastModifiedBy: String
    lastModifiedTime: String
    paymentCancellation: PaymentCancellation
    paymentRefund: PaymentRefund
    registration: ID
    signups: [Signup]
  }

  type SignupsResponse {
    meta: Meta!
    data: [Signup!]!
  }

  type SendMessageResponse {
    htmlMessage: String!
    message: String!
    signups: [String!]
    subject: String!
  }
`);
