import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
};

export enum AttendeeStatus {
  Attending = 'attending',
  Waitlisted = 'waitlisted'
}

export type ContactPerson = {
  __typename?: 'ContactPerson';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  membershipNumber?: Maybe<Scalars['String']['output']>;
  nativeLanguage?: Maybe<Scalars['String']['output']>;
  notifications?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  serviceLanguage?: Maybe<Scalars['String']['output']>;
};

export type ContactPersonInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  membershipNumber?: InputMaybe<Scalars['String']['input']>;
  nativeLanguage?: InputMaybe<Scalars['String']['input']>;
  notifications?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  serviceLanguage?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['Int']['input']>;
  audienceMinAge?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<LocalisedObjectInput>;
  endTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  environmentalCertificate?: InputMaybe<Scalars['String']['input']>;
  eventStatus?: InputMaybe<EventStatus>;
  externalLinks?: InputMaybe<Array<InputMaybe<ExternalLinkInput>>>;
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  location?: InputMaybe<IdObjectInput>;
  locationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<LocalisedObjectInput>;
  offers?: InputMaybe<Array<OfferInput>>;
  provider?: InputMaybe<LocalisedObjectInput>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<LocalisedObjectInput>;
  startTime?: InputMaybe<Scalars['String']['input']>;
  subEvents?: InputMaybe<Array<IdObjectInput>>;
  superEvent?: InputMaybe<IdObjectInput>;
  superEventType?: InputMaybe<SuperEventType>;
  typeId?: InputMaybe<EventTypeId>;
  userConsent?: InputMaybe<Scalars['Boolean']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
  userOrganization?: InputMaybe<Scalars['String']['input']>;
  userPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  videos?: InputMaybe<Array<InputMaybe<VideoInput>>>;
};

export type CreateKeywordMutationInput = {
  dataSource?: InputMaybe<Scalars['String']['input']>;
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<LocalisedObjectInput>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  replacedBy?: InputMaybe<Scalars['String']['input']>;
};

export type CreateKeywordSetMutationInput = {
  dataSource?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  name?: InputMaybe<LocalisedObjectInput>;
  organization?: InputMaybe<Scalars['String']['input']>;
  usage?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationMutationInput = {
  adminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  affiliatedOrganizations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classification?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  dissolutionDate?: InputMaybe<Scalars['String']['input']>;
  financialAdminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  foundingDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  internalType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  originId?: InputMaybe<Scalars['String']['input']>;
  parentOrganization?: InputMaybe<Scalars['String']['input']>;
  registrationAdminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regularUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  replacedBy?: InputMaybe<Scalars['String']['input']>;
  subOrganizations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  webStoreAccounts?: InputMaybe<Array<InputMaybe<WebStoreAccountInput>>>;
  webStoreMerchants?: InputMaybe<Array<InputMaybe<WebStoreMerchantInput>>>;
};

export type CreatePlaceMutationInput = {
  addressLocality?: InputMaybe<LocalisedObjectInput>;
  addressRegion?: InputMaybe<Scalars['String']['input']>;
  contactType?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<LocalisedObjectInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  name?: InputMaybe<LocalisedObjectInput>;
  originId?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<PositionInput>;
  postOfficeBoxNum?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<LocalisedObjectInput>;
  telephone?: InputMaybe<LocalisedObjectInput>;
};

export type CreatePriceGroupMutationInput = {
  description?: InputMaybe<LocalisedObjectInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRegistrationMutationInput = {
  audienceMaxAge?: InputMaybe<Scalars['Int']['input']>;
  audienceMinAge?: InputMaybe<Scalars['Int']['input']>;
  confirmationMessage?: InputMaybe<LocalisedObjectInput>;
  enrolmentEndTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']['input']>;
  event: IdObjectInput;
  instructions?: InputMaybe<LocalisedObjectInput>;
  mandatoryFields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  maximumGroupSize?: InputMaybe<Scalars['Int']['input']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  registrationAccount?: InputMaybe<RegistrationAccountInput>;
  registrationMerchant?: InputMaybe<RegistrationMerchantInput>;
  registrationPriceGroups?: InputMaybe<Array<InputMaybe<RegistrationPriceGroupInput>>>;
  registrationUserAccesses?: InputMaybe<Array<InputMaybe<RegistrationUserAccessInput>>>;
  waitingListCapacity?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateSeatsReservationMutationInput = {
  registration: Scalars['ID']['input'];
  seats: Scalars['Int']['input'];
};

export type CreateSignupGroupMutationInput = {
  contactPerson?: InputMaybe<ContactPersonInput>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['ID']['input']>;
  reservationCode?: InputMaybe<Scalars['String']['input']>;
  signups?: InputMaybe<Array<SignupInput>>;
};

export type CreateSignupGroupResponse = {
  __typename?: 'CreateSignupGroupResponse';
  extraInfo?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  registration?: Maybe<Scalars['ID']['output']>;
  signups?: Maybe<Array<Signup>>;
};

export type CreateSignupsMutationInput = {
  registration?: InputMaybe<Scalars['ID']['input']>;
  reservationCode?: InputMaybe<Scalars['String']['input']>;
  signups?: InputMaybe<Array<SignupInput>>;
};

export type DataSource = {
  __typename?: 'DataSource';
  apiKey?: Maybe<Scalars['String']['output']>;
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  createPastEvents?: Maybe<Scalars['Boolean']['output']>;
  editPastEvents?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  private?: Maybe<Scalars['Boolean']['output']>;
  userEditable?: Maybe<Scalars['Boolean']['output']>;
};

export type DataSourcesResponse = {
  __typename?: 'DataSourcesResponse';
  data: Array<Maybe<DataSource>>;
  meta: Meta;
};

export type Division = {
  __typename?: 'Division';
  municipality?: Maybe<Scalars['String']['output']>;
  name?: Maybe<LocalisedObject>;
  ocdId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  audience: Array<Maybe<Keyword>>;
  audienceMaxAge?: Maybe<Scalars['Int']['output']>;
  audienceMinAge?: Maybe<Scalars['Int']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  customData?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  datePublished?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['String']['output']>;
  description?: Maybe<LocalisedObject>;
  endTime?: Maybe<Scalars['String']['output']>;
  enrolmentEndTime?: Maybe<Scalars['String']['output']>;
  enrolmentStartTime?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  environmentalCertificate?: Maybe<Scalars['String']['output']>;
  eventStatus?: Maybe<EventStatus>;
  externalLinks: Array<Maybe<ExternalLink>>;
  id: Scalars['ID']['output'];
  images: Array<Maybe<Image>>;
  inLanguage: Array<Maybe<Language>>;
  infoUrl?: Maybe<LocalisedObject>;
  keywords: Array<Maybe<Keyword>>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Place>;
  locationExtraInfo?: Maybe<LocalisedObject>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']['output']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<LocalisedObject>;
  offers: Array<Maybe<Offer>>;
  provider?: Maybe<LocalisedObject>;
  providerContactInfo?: Maybe<Scalars['String']['output']>;
  publicationStatus?: Maybe<PublicationStatus>;
  publisher?: Maybe<Scalars['ID']['output']>;
  registration?: Maybe<IdObject>;
  shortDescription?: Maybe<LocalisedObject>;
  startTime?: Maybe<Scalars['String']['output']>;
  subEvents: Array<Maybe<Event>>;
  superEvent?: Maybe<Event>;
  superEventType?: Maybe<SuperEventType>;
  typeId?: Maybe<EventTypeId>;
  userConsent?: Maybe<Scalars['Boolean']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
  userOrganization?: Maybe<Scalars['String']['output']>;
  userPhoneNumber?: Maybe<Scalars['String']['output']>;
  videos: Array<Maybe<Video>>;
};

export enum EventStatus {
  EventCancelled = 'EventCancelled',
  EventPostponed = 'EventPostponed',
  EventRescheduled = 'EventRescheduled',
  EventScheduled = 'EventScheduled'
}

export enum EventTypeId {
  Course = 'Course',
  General = 'General',
  Volunteering = 'Volunteering'
}

export type EventsResponse = {
  __typename?: 'EventsResponse';
  data: Array<Maybe<Event>>;
  meta: Meta;
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  language?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ExternalLinkInput = {
  language?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  body?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
};

export type FeedbackInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type IdObject = {
  __typename?: 'IdObject';
  atId?: Maybe<Scalars['String']['output']>;
};

export type IdObjectInput = {
  atId: Scalars['String']['input'];
};

export type Image = {
  __typename?: 'Image';
  altText?: Maybe<Scalars['String']['output']>;
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  cropping?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  license?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  photographerName?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ImagesResponse = {
  __typename?: 'ImagesResponse';
  data: Array<Maybe<Image>>;
  meta: Meta;
};

export type Keyword = {
  __typename?: 'Keyword';
  aggregate?: Maybe<Scalars['Boolean']['output']>;
  altLabels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Image>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  nEvents?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<LocalisedObject>;
  publisher?: Maybe<Scalars['ID']['output']>;
  replacedBy?: Maybe<Scalars['String']['output']>;
};

export type KeywordSet = {
  __typename?: 'KeywordSet';
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Image>;
  keywords?: Maybe<Array<Maybe<Keyword>>>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  name?: Maybe<LocalisedObject>;
  organization?: Maybe<Scalars['String']['output']>;
  usage?: Maybe<Scalars['String']['output']>;
};

export type KeywordSetsResponse = {
  __typename?: 'KeywordSetsResponse';
  data: Array<Maybe<KeywordSet>>;
  meta: Meta;
};

export type KeywordsResponse = {
  __typename?: 'KeywordsResponse';
  data: Array<Maybe<Keyword>>;
  meta: Meta;
};

export type Language = {
  __typename?: 'Language';
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<LocalisedObject>;
  serviceLanguage?: Maybe<Scalars['Boolean']['output']>;
  translationAvailable?: Maybe<Scalars['Boolean']['output']>;
};

export type LanguagesResponse = {
  __typename?: 'LanguagesResponse';
  data: Array<Maybe<Language>>;
  meta: Meta;
};

export type LocalisedObject = {
  __typename?: 'LocalisedObject';
  ar?: Maybe<Scalars['String']['output']>;
  en?: Maybe<Scalars['String']['output']>;
  fi?: Maybe<Scalars['String']['output']>;
  ru?: Maybe<Scalars['String']['output']>;
  sv?: Maybe<Scalars['String']['output']>;
  zhHans?: Maybe<Scalars['String']['output']>;
};

export type LocalisedObjectInput = {
  ar?: InputMaybe<Scalars['String']['input']>;
  en?: InputMaybe<Scalars['String']['input']>;
  fi?: InputMaybe<Scalars['String']['input']>;
  ru?: InputMaybe<Scalars['String']['input']>;
  sv?: InputMaybe<Scalars['String']['input']>;
  zhHans?: InputMaybe<Scalars['String']['input']>;
};

export type Meta = {
  __typename?: 'Meta';
  count: Scalars['Int']['output'];
  next?: Maybe<Scalars['String']['output']>;
  previous?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  createEvents: Array<Event>;
  createKeyword: Keyword;
  createKeywordSet: KeywordSet;
  createOrganization: Organization;
  createPlace: Place;
  createPriceGroup: PriceGroup;
  createRegistration: Registration;
  createSeatsReservation: SeatsReservation;
  createSignupGroup: CreateSignupGroupResponse;
  createSignups: Array<Signup>;
  deleteEvent?: Maybe<NoContent>;
  deleteImage?: Maybe<NoContent>;
  deleteKeyword?: Maybe<NoContent>;
  deleteKeywordSet?: Maybe<NoContent>;
  deleteOrganization?: Maybe<NoContent>;
  deletePlace?: Maybe<NoContent>;
  deletePriceGroup?: Maybe<NoContent>;
  deleteRegistration?: Maybe<NoContent>;
  deleteSignup?: Maybe<NoContent>;
  deleteSignupGroup?: Maybe<NoContent>;
  patchOrganization: Organization;
  postFeedback?: Maybe<Feedback>;
  postGuestFeedback?: Maybe<Feedback>;
  sendMessage?: Maybe<SendMessageResponse>;
  sendRegistrationUserAccessInvitation?: Maybe<NoContent>;
  updateEvent: Event;
  updateEvents: Array<Event>;
  updateImage: Image;
  updateKeyword: Keyword;
  updateKeywordSet: KeywordSet;
  updateOrganization: Organization;
  updatePlace: Place;
  updatePriceGroup: PriceGroup;
  updateRegistration: Registration;
  updateSeatsReservation: SeatsReservation;
  updateSignup: Signup;
  updateSignupGroup: SignupGroup;
  uploadImage: Image;
};


export type MutationCreateEventArgs = {
  input: CreateEventMutationInput;
};


export type MutationCreateEventsArgs = {
  input: Array<CreateEventMutationInput>;
};


export type MutationCreateKeywordArgs = {
  input: CreateKeywordMutationInput;
};


export type MutationCreateKeywordSetArgs = {
  input: CreateKeywordSetMutationInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationMutationInput;
};


export type MutationCreatePlaceArgs = {
  input: CreatePlaceMutationInput;
};


export type MutationCreatePriceGroupArgs = {
  input: CreatePriceGroupMutationInput;
};


export type MutationCreateRegistrationArgs = {
  input: CreateRegistrationMutationInput;
};


export type MutationCreateSeatsReservationArgs = {
  input: CreateSeatsReservationMutationInput;
};


export type MutationCreateSignupGroupArgs = {
  input: CreateSignupGroupMutationInput;
};


export type MutationCreateSignupsArgs = {
  input: CreateSignupsMutationInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteKeywordArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteKeywordSetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlaceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePriceGroupArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRegistrationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSignupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSignupGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPatchOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationMutationInput;
};


export type MutationPostFeedbackArgs = {
  input: FeedbackInput;
};


export type MutationPostGuestFeedbackArgs = {
  input: FeedbackInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageMutationInput;
  registration?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSendRegistrationUserAccessInvitationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateEventArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEventMutationInput;
};


export type MutationUpdateEventsArgs = {
  input: Array<UpdateEventMutationInput>;
};


export type MutationUpdateImageArgs = {
  id: Scalars['ID']['input'];
  input: UpdateImageMutationInput;
};


export type MutationUpdateKeywordArgs = {
  id: Scalars['ID']['input'];
  input: UpdateKeywordMutationInput;
};


export type MutationUpdateKeywordSetArgs = {
  id: Scalars['ID']['input'];
  input: UpdateKeywordSetMutationInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationMutationInput;
};


export type MutationUpdatePlaceArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePlaceMutationInput;
};


export type MutationUpdatePriceGroupArgs = {
  id: Scalars['Int']['input'];
  input: UpdatePriceGroupMutationInput;
};


export type MutationUpdateRegistrationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRegistrationMutationInput;
};


export type MutationUpdateSeatsReservationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSeatsReservationMutationInput;
};


export type MutationUpdateSignupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSignupMutationInput;
};


export type MutationUpdateSignupGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSignupGroupMutationInput;
};


export type MutationUploadImageArgs = {
  input: UploadImageMutationInput;
};

export type NoContent = {
  __typename?: 'NoContent';
  noContent?: Maybe<Scalars['Boolean']['output']>;
};

export type Offer = {
  __typename?: 'Offer';
  description?: Maybe<LocalisedObject>;
  infoUrl?: Maybe<LocalisedObject>;
  isFree?: Maybe<Scalars['Boolean']['output']>;
  offerPriceGroups?: Maybe<Array<Maybe<OfferPriceGroup>>>;
  price?: Maybe<LocalisedObject>;
};

export type OfferInput = {
  description?: InputMaybe<LocalisedObjectInput>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  offerPriceGroups?: InputMaybe<Array<InputMaybe<OfferPriceGroupInput>>>;
  price?: InputMaybe<LocalisedObjectInput>;
};

export type OfferPriceGroup = {
  __typename?: 'OfferPriceGroup';
  id?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  priceGroup?: Maybe<PriceGroupDense>;
  priceWithoutVat?: Maybe<Scalars['String']['output']>;
  vat?: Maybe<Scalars['String']['output']>;
  vatPercentage?: Maybe<Scalars['String']['output']>;
};

export type OfferPriceGroupInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  priceGroup?: InputMaybe<Scalars['Int']['input']>;
  vatPercentage?: InputMaybe<Scalars['String']['input']>;
};

export type Organization = {
  __typename?: 'Organization';
  adminUsers?: Maybe<Array<Maybe<User>>>;
  affiliatedOrganizations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  dissolutionDate?: Maybe<Scalars['String']['output']>;
  financialAdminUsers?: Maybe<Array<Maybe<User>>>;
  foundingDate?: Maybe<Scalars['String']['output']>;
  hasRegularUsers?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isAffiliated?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentOrganization?: Maybe<Scalars['String']['output']>;
  registrationAdminUsers?: Maybe<Array<Maybe<User>>>;
  regularUsers?: Maybe<Array<Maybe<User>>>;
  replacedBy?: Maybe<Scalars['String']['output']>;
  subOrganizations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  webStoreAccounts?: Maybe<Array<Maybe<WebStoreAccount>>>;
  webStoreMerchants?: Maybe<Array<Maybe<WebStoreMerchant>>>;
};

export type OrganizationClass = {
  __typename?: 'OrganizationClass';
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type OrganizationClassesResponse = {
  __typename?: 'OrganizationClassesResponse';
  data: Array<Maybe<OrganizationClass>>;
  meta: Meta;
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  data: Array<Maybe<Organization>>;
  meta: Meta;
};

export type Place = {
  __typename?: 'Place';
  addressCountry?: Maybe<Scalars['String']['output']>;
  addressLocality?: Maybe<LocalisedObject>;
  addressRegion?: Maybe<Scalars['String']['output']>;
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  contactType?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  customData?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<LocalisedObject>;
  divisions: Array<Maybe<Division>>;
  email?: Maybe<Scalars['String']['output']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Image>;
  infoUrl?: Maybe<LocalisedObject>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  nEvents?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<LocalisedObject>;
  parent?: Maybe<Scalars['ID']['output']>;
  position?: Maybe<Position>;
  postOfficeBoxNum?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['ID']['output']>;
  replacedBy?: Maybe<Scalars['String']['output']>;
  streetAddress?: Maybe<LocalisedObject>;
  telephone?: Maybe<LocalisedObject>;
};

export type PlacesResponse = {
  __typename?: 'PlacesResponse';
  data: Array<Maybe<Place>>;
  meta: Meta;
};

export type Position = {
  __typename?: 'Position';
  coordinates: Array<Maybe<Scalars['Float']['output']>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type PositionInput = {
  coordinates: Array<InputMaybe<Scalars['Float']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export enum PresenceStatus {
  NotPresent = 'not_present',
  Present = 'present'
}

export type PriceGroup = {
  __typename?: 'PriceGroup';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  description?: Maybe<LocalisedObject>;
  id: Scalars['Int']['output'];
  isFree?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
};

export type PriceGroupDense = {
  __typename?: 'PriceGroupDense';
  description?: Maybe<LocalisedObject>;
  id: Scalars['Int']['output'];
};

export type PriceGroupsResponse = {
  __typename?: 'PriceGroupsResponse';
  data: Array<Maybe<PriceGroup>>;
  meta: Meta;
};

export enum PublicationStatus {
  Draft = 'draft',
  Public = 'public'
}

export type Query = {
  __typename?: 'Query';
  dataSource: DataSource;
  dataSources: DataSourcesResponse;
  event: Event;
  events: EventsResponse;
  image: Image;
  images: ImagesResponse;
  keyword: Keyword;
  keywordSet?: Maybe<KeywordSet>;
  keywordSets: KeywordSetsResponse;
  keywords: KeywordsResponse;
  languages: LanguagesResponse;
  organization: Organization;
  organizationAccounts: Array<WebStoreAccount>;
  organizationClass: OrganizationClass;
  organizationClasses: OrganizationClassesResponse;
  organizationMerchants: Array<WebStoreMerchant>;
  organizations: OrganizationsResponse;
  place: Place;
  places: PlacesResponse;
  priceGroup: PriceGroup;
  priceGroups: PriceGroupsResponse;
  registration: Registration;
  registrations: RegistrationsResponse;
  signup: Signup;
  signupGroup: SignupGroup;
  signups: SignupsResponse;
  user: User;
  users: UsersResponse;
};


export type QueryDataSourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDataSourcesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryEventsArgs = {
  adminUser?: InputMaybe<Scalars['Boolean']['input']>;
  combinedText?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  end?: InputMaybe<Scalars['String']['input']>;
  endsAfter?: InputMaybe<Scalars['String']['input']>;
  endsBefore?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>>>;
  inLanguage?: InputMaybe<Scalars['String']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  keywordAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  registration?: InputMaybe<Scalars['Boolean']['input']>;
  registrationAdminUser?: InputMaybe<Scalars['Boolean']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  startsAfter?: InputMaybe<Scalars['String']['input']>;
  startsBefore?: InputMaybe<Scalars['String']['input']>;
  superEvent?: InputMaybe<Scalars['ID']['input']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  translation?: InputMaybe<Scalars['String']['input']>;
};


export type QueryImageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryImagesArgs = {
  createdBy?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  mergePages?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Scalars['ID']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryKeywordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryKeywordSetArgs = {
  id: Scalars['ID']['input'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryKeywordSetsArgs = {
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryKeywordsArgs = {
  dataSource?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  freeText?: InputMaybe<Scalars['String']['input']>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLanguagesArgs = {
  serviceLanguage?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryOrganizationArgs = {
  dissolved?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryOrganizationAccountsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationClassArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationClassesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrganizationMerchantsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  child?: InputMaybe<Scalars['ID']['input']>;
  dissolved?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPlaceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlacesArgs = {
  dataSource?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPriceGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPriceGroupsArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRegistrationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryRegistrationsArgs = {
  adminUser?: InputMaybe<Scalars['Boolean']['input']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>>>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySignupArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySignupGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySignupsArgs = {
  attendeeStatus?: InputMaybe<AttendeeStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  registration?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type Registration = {
  __typename?: 'Registration';
  atContext?: Maybe<Scalars['String']['output']>;
  atId: Scalars['String']['output'];
  atType?: Maybe<Scalars['String']['output']>;
  attendeeRegistration?: Maybe<Scalars['Boolean']['output']>;
  audienceMaxAge?: Maybe<Scalars['Int']['output']>;
  audienceMinAge?: Maybe<Scalars['Int']['output']>;
  confirmationMessage?: Maybe<LocalisedObject>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  currentAttendeeCount?: Maybe<Scalars['Int']['output']>;
  currentWaitingListCount?: Maybe<Scalars['Int']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  enrolmentEndTime?: Maybe<Scalars['String']['output']>;
  enrolmentStartTime?: Maybe<Scalars['String']['output']>;
  event?: Maybe<Event>;
  hasRegistrationUserAccess?: Maybe<Scalars['Boolean']['output']>;
  hasSubstituteUserAccess?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  instructions?: Maybe<LocalisedObject>;
  isCreatedByCurrentUser?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  mandatoryFields?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']['output']>;
  maximumGroupSize?: Maybe<Scalars['Int']['output']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  registrationAccount?: Maybe<RegistrationAccount>;
  registrationMerchant?: Maybe<RegistrationMerchant>;
  registrationPriceGroups?: Maybe<Array<Maybe<RegistrationPriceGroup>>>;
  registrationUserAccesses?: Maybe<Array<Maybe<RegistrationUserAccess>>>;
  remainingAttendeeCapacity?: Maybe<Scalars['Int']['output']>;
  remainingWaitingListCapacity?: Maybe<Scalars['Int']['output']>;
  signups?: Maybe<Array<Maybe<Signup>>>;
  waitingListCapacity?: Maybe<Scalars['Int']['output']>;
};

export type RegistrationAccount = {
  __typename?: 'RegistrationAccount';
  account?: Maybe<Scalars['Int']['output']>;
  balanceProfitCenter?: Maybe<Scalars['String']['output']>;
  companyCode?: Maybe<Scalars['String']['output']>;
  internalOrder?: Maybe<Scalars['String']['output']>;
  mainLedgerAccount?: Maybe<Scalars['String']['output']>;
  operationArea?: Maybe<Scalars['String']['output']>;
  profitCenter?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
};

export type RegistrationAccountInput = {
  account?: InputMaybe<Scalars['Int']['input']>;
  balanceProfitCenter?: InputMaybe<Scalars['String']['input']>;
  companyCode?: InputMaybe<Scalars['String']['input']>;
  internalOrder?: InputMaybe<Scalars['String']['input']>;
  mainLedgerAccount?: InputMaybe<Scalars['String']['input']>;
  operationArea?: InputMaybe<Scalars['String']['input']>;
  profitCenter?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
};

export type RegistrationMerchant = {
  __typename?: 'RegistrationMerchant';
  merchant?: Maybe<Scalars['Int']['output']>;
};

export type RegistrationMerchantInput = {
  merchant?: InputMaybe<Scalars['Int']['input']>;
};

export type RegistrationPriceGroup = {
  __typename?: 'RegistrationPriceGroup';
  id?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  priceGroup?: Maybe<PriceGroupDense>;
  priceWithoutVat?: Maybe<Scalars['String']['output']>;
  vat?: Maybe<Scalars['String']['output']>;
  vatPercentage?: Maybe<Scalars['String']['output']>;
};

export type RegistrationPriceGroupInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  priceGroup?: InputMaybe<Scalars['Int']['input']>;
  vatPercentage?: InputMaybe<Scalars['String']['input']>;
};

export type RegistrationUserAccess = {
  __typename?: 'RegistrationUserAccess';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isSubstituteUser?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
};

export type RegistrationUserAccessInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isSubstituteUser?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type RegistrationsResponse = {
  __typename?: 'RegistrationsResponse';
  data: Array<Maybe<Registration>>;
  meta: Meta;
};

export type SeatsReservation = {
  __typename?: 'SeatsReservation';
  code: Scalars['String']['output'];
  expiration: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inWaitlist: Scalars['Boolean']['output'];
  registration: Scalars['ID']['output'];
  seats: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
};

export type SendMessageMutationInput = {
  body: Scalars['String']['input'];
  signupGroups?: InputMaybe<Array<Scalars['String']['input']>>;
  signups?: InputMaybe<Array<Scalars['String']['input']>>;
  subject: Scalars['String']['input'];
};

export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  htmlMessage: Scalars['String']['output'];
  message: Scalars['String']['output'];
  signups?: Maybe<Array<Scalars['String']['output']>>;
  subject: Scalars['String']['output'];
};

export type Signup = {
  __typename?: 'Signup';
  attendeeStatus?: Maybe<AttendeeStatus>;
  city?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<ContactPerson>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  extraInfo?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  presenceStatus?: Maybe<PresenceStatus>;
  priceGroup?: Maybe<SignupPriceGroup>;
  registration?: Maybe<Scalars['ID']['output']>;
  signupGroup?: Maybe<Scalars['ID']['output']>;
  streetAddress?: Maybe<Scalars['String']['output']>;
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type SignupGroup = {
  __typename?: 'SignupGroup';
  contactPerson?: Maybe<ContactPerson>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  extraInfo?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Scalars['ID']['output']>;
  signups?: Maybe<Array<Maybe<Signup>>>;
};

export type SignupInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<ContactPersonInput>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  presenceStatus?: InputMaybe<PresenceStatus>;
  priceGroup?: InputMaybe<SignupPriceGroupInput>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type SignupPriceGroup = {
  __typename?: 'SignupPriceGroup';
  id?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  priceGroup?: Maybe<PriceGroupDense>;
  priceWithoutVat?: Maybe<Scalars['String']['output']>;
  registrationPriceGroup?: Maybe<Scalars['Int']['output']>;
  vat?: Maybe<Scalars['String']['output']>;
  vatPercentage?: Maybe<Scalars['String']['output']>;
};

export type SignupPriceGroupInput = {
  registrationPriceGroup?: InputMaybe<Scalars['ID']['input']>;
};

export type SignupsResponse = {
  __typename?: 'SignupsResponse';
  data: Array<Signup>;
  meta: Meta;
};

export enum SuperEventType {
  Recurring = 'recurring',
  Umbrella = 'umbrella'
}

export type UpdateEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['Int']['input']>;
  audienceMinAge?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<LocalisedObjectInput>;
  endTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  environmentalCertificate?: InputMaybe<Scalars['String']['input']>;
  eventStatus?: InputMaybe<EventStatus>;
  externalLinks?: InputMaybe<Array<InputMaybe<ExternalLinkInput>>>;
  id: Scalars['ID']['input'];
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  location?: InputMaybe<IdObjectInput>;
  locationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<LocalisedObjectInput>;
  offers?: InputMaybe<Array<OfferInput>>;
  provider?: InputMaybe<LocalisedObjectInput>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  shortDescription?: InputMaybe<LocalisedObjectInput>;
  startTime?: InputMaybe<Scalars['String']['input']>;
  subEvents?: InputMaybe<Array<IdObjectInput>>;
  superEvent?: InputMaybe<IdObjectInput>;
  superEventType?: InputMaybe<SuperEventType>;
  typeId?: InputMaybe<EventTypeId>;
  userConsent?: InputMaybe<Scalars['Boolean']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
  userOrganization?: InputMaybe<Scalars['String']['input']>;
  userPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  videos?: InputMaybe<Array<InputMaybe<VideoInput>>>;
};

export type UpdateImageMutationInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  license?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photographerName?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateKeywordMutationInput = {
  dataSource?: InputMaybe<Scalars['String']['input']>;
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<LocalisedObjectInput>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  replacedBy?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateKeywordSetMutationInput = {
  dataSource?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  name?: InputMaybe<LocalisedObjectInput>;
  organization?: InputMaybe<Scalars['String']['input']>;
  usage?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationMutationInput = {
  adminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  affiliatedOrganizations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classification?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  dissolutionDate?: InputMaybe<Scalars['String']['input']>;
  financialAdminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  foundingDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  internalType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentOrganization?: InputMaybe<Scalars['String']['input']>;
  registrationAdminUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regularUsers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  replacedBy?: InputMaybe<Scalars['String']['input']>;
  subOrganizations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  webStoreAccounts?: InputMaybe<Array<InputMaybe<WebStoreAccountInput>>>;
  webStoreMerchants?: InputMaybe<Array<InputMaybe<WebStoreMerchantInput>>>;
};

export type UpdatePlaceMutationInput = {
  addressLocality?: InputMaybe<LocalisedObjectInput>;
  addressRegion?: InputMaybe<Scalars['String']['input']>;
  contactType?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<LocalisedObjectInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  name?: InputMaybe<LocalisedObjectInput>;
  position?: InputMaybe<PositionInput>;
  postOfficeBoxNum?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<LocalisedObjectInput>;
  telephone?: InputMaybe<LocalisedObjectInput>;
};

export type UpdatePriceGroupMutationInput = {
  description?: InputMaybe<LocalisedObjectInput>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRegistrationMutationInput = {
  audienceMaxAge?: InputMaybe<Scalars['Int']['input']>;
  audienceMinAge?: InputMaybe<Scalars['Int']['input']>;
  confirmationMessage?: InputMaybe<LocalisedObjectInput>;
  enrolmentEndTime?: InputMaybe<Scalars['String']['input']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']['input']>;
  event: IdObjectInput;
  instructions?: InputMaybe<LocalisedObjectInput>;
  mandatoryFields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  maximumGroupSize?: InputMaybe<Scalars['Int']['input']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']['input']>;
  registrationAccount?: InputMaybe<RegistrationAccountInput>;
  registrationMerchant?: InputMaybe<RegistrationMerchantInput>;
  registrationPriceGroups?: InputMaybe<Array<InputMaybe<RegistrationPriceGroupInput>>>;
  registrationUserAccesses?: InputMaybe<Array<InputMaybe<RegistrationUserAccessInput>>>;
  waitingListCapacity?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSeatsReservationMutationInput = {
  code: Scalars['String']['input'];
  registration: Scalars['ID']['input'];
  seats: Scalars['Int']['input'];
};

export type UpdateSignupGroupMutationInput = {
  contactPerson?: InputMaybe<ContactPersonInput>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['ID']['input']>;
  signups?: InputMaybe<Array<SignupInput>>;
};

export type UpdateSignupMutationInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<ContactPersonInput>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  presenceStatus?: InputMaybe<PresenceStatus>;
  registration?: InputMaybe<Scalars['ID']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type UploadImageMutationInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Any']['input']>;
  license?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photographerName?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  adminOrganizations: Array<Scalars['String']['output']>;
  dateJoined?: Maybe<Scalars['String']['output']>;
  departmentName?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  financialAdminOrganizations: Array<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isExternal?: Maybe<Scalars['Boolean']['output']>;
  isStaff?: Maybe<Scalars['Boolean']['output']>;
  isSubstituteUser?: Maybe<Scalars['Boolean']['output']>;
  isSuperuser?: Maybe<Scalars['Boolean']['output']>;
  lastLogin?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  organizationMemberships: Array<Scalars['String']['output']>;
  registrationAdminOrganizations: Array<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  data: Array<Maybe<User>>;
  meta: Meta;
};

export type Video = {
  __typename?: 'Video';
  altText?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type VideoInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type WebStoreAccount = {
  __typename?: 'WebStoreAccount';
  active?: Maybe<Scalars['Boolean']['output']>;
  balanceProfitCenter?: Maybe<Scalars['String']['output']>;
  companyCode?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  internalOrder?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  mainLedgerAccount?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  operationArea?: Maybe<Scalars['String']['output']>;
  profitCenter?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
};

export type WebStoreAccountInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  balanceProfitCenter?: InputMaybe<Scalars['String']['input']>;
  companyCode?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  internalOrder?: InputMaybe<Scalars['String']['input']>;
  mainLedgerAccount?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  operationArea?: InputMaybe<Scalars['String']['input']>;
  profitCenter?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
};

export type WebStoreMerchant = {
  __typename?: 'WebStoreMerchant';
  active?: Maybe<Scalars['Boolean']['output']>;
  businessId?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedTime?: Maybe<Scalars['String']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  paytrailMerchantId?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  streetAddress?: Maybe<Scalars['String']['output']>;
  termsOfServiceUrl?: Maybe<Scalars['String']['output']>;
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type WebStoreMerchantInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  businessId?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  paytrailMerchantId?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  termsOfServiceUrl?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type DataSourceFieldsFragment = { __typename?: 'DataSource', apiKey?: string | null, createPastEvents?: boolean | null, editPastEvents?: boolean | null, id?: string | null, name?: string | null, owner?: string | null, private?: boolean | null, userEditable?: boolean | null };

export type DataSourceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type DataSourceQuery = { __typename?: 'Query', dataSource: { __typename?: 'DataSource', apiKey?: string | null, createPastEvents?: boolean | null, editPastEvents?: boolean | null, id?: string | null, name?: string | null, owner?: string | null, private?: boolean | null, userEditable?: boolean | null } };

export type DataSourcesQueryVariables = Exact<{
  createPath?: InputMaybe<Scalars['Any']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DataSourcesQuery = { __typename?: 'Query', dataSources: { __typename?: 'DataSourcesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'DataSource', apiKey?: string | null, createPastEvents?: boolean | null, editPastEvents?: boolean | null, id?: string | null, name?: string | null, owner?: string | null, private?: boolean | null, userEditable?: boolean | null } | null> } };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventMutationInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateEventMutationInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } };

export type CreateEventsMutationVariables = Exact<{
  input: Array<CreateEventMutationInput> | CreateEventMutationInput;
}>;


export type CreateEventsMutation = { __typename?: 'Mutation', createEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> }> };

export type UpdateEventsMutationVariables = Exact<{
  input: Array<UpdateEventMutationInput> | UpdateEventMutationInput;
}>;


export type UpdateEventsMutation = { __typename?: 'Mutation', updateEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> }> };

export type ExternalLinkFieldsFragment = { __typename?: 'ExternalLink', name?: string | null, link?: string | null };

export type VideoFieldsFragment = { __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null };

export type OfferPriceGroupFieldsFragment = { __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null };

export type OfferFieldsFragment = { __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type BaseEventFieldsFragment = { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> };

export type EventFieldsFragment = { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> };

export type EventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } };

export type EventsQueryVariables = Exact<{
  adminUser?: InputMaybe<Scalars['Boolean']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  combinedText?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  end?: InputMaybe<Scalars['String']['input']>;
  endsAfter?: InputMaybe<Scalars['String']['input']>;
  endsBefore?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>> | InputMaybe<EventTypeId>>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  inLanguage?: InputMaybe<Scalars['String']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  keywordAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  language?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  registration?: InputMaybe<Scalars['Boolean']['input']>;
  registrationAdminUser?: InputMaybe<Scalars['Boolean']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  startsAfter?: InputMaybe<Scalars['String']['input']>;
  startsBefore?: InputMaybe<Scalars['String']['input']>;
  superEvent?: InputMaybe<Scalars['ID']['input']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
  translation?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'EventsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null> } };

export type PostFeedbackMutationVariables = Exact<{
  input: FeedbackInput;
}>;


export type PostFeedbackMutation = { __typename?: 'Mutation', postFeedback?: { __typename?: 'Feedback', id?: string | null, name?: string | null, email?: string | null, subject?: string | null, body?: string | null } | null };

export type PostGuestFeedbackMutationVariables = Exact<{
  input: FeedbackInput;
}>;


export type PostGuestFeedbackMutation = { __typename?: 'Mutation', postGuestFeedback?: { __typename?: 'Feedback', id?: string | null, name?: string | null, email?: string | null, subject?: string | null, body?: string | null } | null };

export type FeedbackFieldsFragment = { __typename?: 'Feedback', id?: string | null, name?: string | null, email?: string | null, subject?: string | null, body?: string | null };

export type LocalisedFieldsFragment = { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null };

export type IdObjectFieldsFragment = { __typename?: 'IdObject', atId?: string | null };

export type MetaFieldsFragment = { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null };

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateImageMutationInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', updateImage: { __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } };

export type UploadImageMutationVariables = Exact<{
  input: UploadImageMutationInput;
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } };

export type ImageFieldsFragment = { __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null };

export type ImageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type ImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } };

export type ImagesQueryVariables = Exact<{
  createdBy?: InputMaybe<Scalars['String']['input']>;
  dataSource?: InputMaybe<Scalars['String']['input']>;
  mergePages?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Scalars['ID']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type ImagesQuery = { __typename?: 'Query', images: { __typename?: 'ImagesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null> } };

export type CreateKeywordMutationVariables = Exact<{
  input: CreateKeywordMutationInput;
}>;


export type CreateKeywordMutation = { __typename?: 'Mutation', createKeyword: { __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type DeleteKeywordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteKeywordMutation = { __typename?: 'Mutation', deleteKeyword?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateKeywordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateKeywordMutationInput;
}>;


export type UpdateKeywordMutation = { __typename?: 'Mutation', updateKeyword: { __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type KeywordFieldsFragment = { __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type KeywordQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type KeywordQuery = { __typename?: 'Query', keyword: { __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type KeywordsQueryVariables = Exact<{
  dataSource?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  freeText?: InputMaybe<Scalars['String']['input']>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type KeywordsQuery = { __typename?: 'Query', keywords: { __typename?: 'KeywordsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> } };

export type CreateKeywordSetMutationVariables = Exact<{
  input: CreateKeywordSetMutationInput;
}>;


export type CreateKeywordSetMutation = { __typename?: 'Mutation', createKeywordSet: { __typename?: 'KeywordSet', id?: string | null, atId: string, dataSource?: string | null, organization?: string | null, usage?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type DeleteKeywordSetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteKeywordSetMutation = { __typename?: 'Mutation', deleteKeywordSet?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateKeywordSetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateKeywordSetMutationInput;
}>;


export type UpdateKeywordSetMutation = { __typename?: 'Mutation', updateKeywordSet: { __typename?: 'KeywordSet', id?: string | null, atId: string, dataSource?: string | null, organization?: string | null, usage?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type KeywordSetFieldsFragment = { __typename?: 'KeywordSet', id?: string | null, atId: string, dataSource?: string | null, organization?: string | null, usage?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type KeywordSetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type KeywordSetQuery = { __typename?: 'Query', keywordSet?: { __typename?: 'KeywordSet', id?: string | null, atId: string, dataSource?: string | null, organization?: string | null, usage?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null };

export type KeywordSetsQueryVariables = Exact<{
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type KeywordSetsQuery = { __typename?: 'Query', keywordSets: { __typename?: 'KeywordSetsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'KeywordSet', id?: string | null, atId: string, dataSource?: string | null, organization?: string | null, usage?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> } };

export type LanguageFieldsFragment = { __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type LanguagesQueryVariables = Exact<{
  serviceLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type LanguagesQuery = { __typename?: 'Query', languages: { __typename?: 'LanguagesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> } };

export type CreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationMutationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null } };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type PatchOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrganizationMutationInput;
}>;


export type PatchOrganizationMutation = { __typename?: 'Mutation', patchOrganization: { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null } };

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrganizationMutationInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null } };

export type WebStoreAccountFieldsFragment = { __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null };

export type WebStoreMerchantFieldsFragment = { __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null };

export type OrganizationFieldsFragment = { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null };

export type OrganizationMerchantsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrganizationMerchantsQuery = { __typename?: 'Query', organizationMerchants: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null }> };

export type OrganizationAccountsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrganizationAccountsQuery = { __typename?: 'Query', organizationAccounts: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null }> };

export type OrganizationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
  dissolved?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type OrganizationQuery = { __typename?: 'Query', organization: { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null } };

export type OrganizationsQueryVariables = Exact<{
  child?: InputMaybe<Scalars['ID']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  dissolved?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrganizationsQuery = { __typename?: 'Query', organizations: { __typename?: 'OrganizationsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Organization', affiliatedOrganizations?: Array<string | null> | null, atId: string, classification?: string | null, createdTime?: string | null, dataSource?: string | null, dissolutionDate?: string | null, foundingDate?: string | null, hasRegularUsers?: boolean | null, id?: string | null, isAffiliated?: boolean | null, lastModifiedTime?: string | null, name?: string | null, parentOrganization?: string | null, replacedBy?: string | null, subOrganizations?: Array<string | null> | null, adminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, financialAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, registrationAdminUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, regularUsers?: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> | null, webStoreAccounts?: Array<{ __typename?: 'WebStoreAccount', active?: boolean | null, balanceProfitCenter?: string | null, companyCode?: string | null, id?: number | null, internalOrder?: string | null, mainLedgerAccount?: string | null, name?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null> | null, webStoreMerchants?: Array<{ __typename?: 'WebStoreMerchant', active?: boolean | null, businessId?: string | null, city?: string | null, email?: string | null, id?: number | null, merchantId?: string | null, name?: string | null, paytrailMerchantId?: string | null, phoneNumber?: string | null, streetAddress?: string | null, termsOfServiceUrl?: string | null, zipcode?: string | null } | null> | null } | null> } };

export type OrganizationClassFieldsFragment = { __typename?: 'OrganizationClass', createdTime?: string | null, dataSource?: string | null, id?: string | null, lastModifiedTime?: string | null, name?: string | null };

export type OrganizationClassQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type OrganizationClassQuery = { __typename?: 'Query', organizationClass: { __typename?: 'OrganizationClass', createdTime?: string | null, dataSource?: string | null, id?: string | null, lastModifiedTime?: string | null, name?: string | null } };

export type OrganizationClassesQueryVariables = Exact<{
  createPath?: InputMaybe<Scalars['Any']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OrganizationClassesQuery = { __typename?: 'Query', organizationClasses: { __typename?: 'OrganizationClassesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'OrganizationClass', createdTime?: string | null, dataSource?: string | null, id?: string | null, lastModifiedTime?: string | null, name?: string | null } | null> } };

export type CreatePlaceMutationVariables = Exact<{
  input: CreatePlaceMutationInput;
}>;


export type CreatePlaceMutation = { __typename?: 'Mutation', createPlace: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } };

export type DeletePlaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaceMutation = { __typename?: 'Mutation', deletePlace?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdatePlaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePlaceMutationInput;
}>;


export type UpdatePlaceMutation = { __typename?: 'Mutation', updatePlace: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } };

export type DivisionFieldsFragment = { __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type PositionFieldsFragment = { __typename?: 'Position', coordinates: Array<number | null> };

export type PlaceFieldsFragment = { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null };

export type PlaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type PlaceQuery = { __typename?: 'Query', place: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } };

export type PlacesQueryVariables = Exact<{
  dataSource?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type PlacesQuery = { __typename?: 'Query', places: { __typename?: 'PlacesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null> } };

export type CreatePriceGroupMutationVariables = Exact<{
  input: CreatePriceGroupMutationInput;
}>;


export type CreatePriceGroupMutation = { __typename?: 'Mutation', createPriceGroup: { __typename?: 'PriceGroup', id: number, isFree?: boolean | null, publisher?: string | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type DeletePriceGroupMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeletePriceGroupMutation = { __typename?: 'Mutation', deletePriceGroup?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdatePriceGroupMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdatePriceGroupMutationInput;
}>;


export type UpdatePriceGroupMutation = { __typename?: 'Mutation', updatePriceGroup: { __typename?: 'PriceGroup', id: number, isFree?: boolean | null, publisher?: string | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type PriceGroupFieldsFragment = { __typename?: 'PriceGroup', id: number, isFree?: boolean | null, publisher?: string | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type PriceGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PriceGroupQuery = { __typename?: 'Query', priceGroup: { __typename?: 'PriceGroup', id: number, isFree?: boolean | null, publisher?: string | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } };

export type PriceGroupsQueryVariables = Exact<{
  description?: InputMaybe<Scalars['String']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type PriceGroupsQuery = { __typename?: 'Query', priceGroups: { __typename?: 'PriceGroupsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'PriceGroup', id: number, isFree?: boolean | null, publisher?: string | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null> } };

export type CreateRegistrationMutationVariables = Exact<{
  input: CreateRegistrationMutationInput;
}>;


export type CreateRegistrationMutation = { __typename?: 'Mutation', createRegistration: { __typename?: 'Registration', id?: string | null, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, currentAttendeeCount?: number | null, currentWaitingListCount?: number | null, dataSource?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, hasRegistrationUserAccess?: boolean | null, hasSubstituteUserAccess?: boolean | null, isCreatedByCurrentUser?: boolean | null, lastModifiedTime?: string | null, mandatoryFields?: Array<string | null> | null, maximumAttendeeCapacity?: number | null, maximumGroupSize?: number | null, minimumAttendeeCapacity?: number | null, remainingAttendeeCapacity?: number | null, remainingWaitingListCapacity?: number | null, publisher?: string | null, waitingListCapacity?: number | null, confirmationMessage?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, event?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, instructions?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registrationAccount?: { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null, registrationMerchant?: { __typename?: 'RegistrationMerchant', merchant?: number | null } | null, registrationPriceGroups?: Array<{ __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, registrationUserAccesses?: Array<{ __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null } | null> | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } };

export type DeleteRegistrationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRegistrationMutation = { __typename?: 'Mutation', deleteRegistration?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateRegistrationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateRegistrationMutationInput;
}>;


export type UpdateRegistrationMutation = { __typename?: 'Mutation', updateRegistration: { __typename?: 'Registration', id?: string | null, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, currentAttendeeCount?: number | null, currentWaitingListCount?: number | null, dataSource?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, hasRegistrationUserAccess?: boolean | null, hasSubstituteUserAccess?: boolean | null, isCreatedByCurrentUser?: boolean | null, lastModifiedTime?: string | null, mandatoryFields?: Array<string | null> | null, maximumAttendeeCapacity?: number | null, maximumGroupSize?: number | null, minimumAttendeeCapacity?: number | null, remainingAttendeeCapacity?: number | null, remainingWaitingListCapacity?: number | null, publisher?: string | null, waitingListCapacity?: number | null, confirmationMessage?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, event?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, instructions?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registrationAccount?: { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null, registrationMerchant?: { __typename?: 'RegistrationMerchant', merchant?: number | null } | null, registrationPriceGroups?: Array<{ __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, registrationUserAccesses?: Array<{ __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null } | null> | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } };

export type DensePriceGroupFieldsFragment = { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null };

export type RegistrationAccountFieldsFragment = { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null };

export type RegistrationMerchantFieldsFragment = { __typename?: 'RegistrationMerchant', merchant?: number | null };

export type RegistrationPriceGroupFieldsFragment = { __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null };

export type RegistrationUserAccessFieldsFragment = { __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null };

export type RegistrationFieldsFragment = { __typename?: 'Registration', id?: string | null, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, currentAttendeeCount?: number | null, currentWaitingListCount?: number | null, dataSource?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, hasRegistrationUserAccess?: boolean | null, hasSubstituteUserAccess?: boolean | null, isCreatedByCurrentUser?: boolean | null, lastModifiedTime?: string | null, mandatoryFields?: Array<string | null> | null, maximumAttendeeCapacity?: number | null, maximumGroupSize?: number | null, minimumAttendeeCapacity?: number | null, remainingAttendeeCapacity?: number | null, remainingWaitingListCapacity?: number | null, publisher?: string | null, waitingListCapacity?: number | null, confirmationMessage?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, event?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, instructions?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registrationAccount?: { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null, registrationMerchant?: { __typename?: 'RegistrationMerchant', merchant?: number | null } | null, registrationPriceGroups?: Array<{ __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, registrationUserAccesses?: Array<{ __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null } | null> | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null };

export type RegistrationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type RegistrationQuery = { __typename?: 'Query', registration: { __typename?: 'Registration', id?: string | null, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, currentAttendeeCount?: number | null, currentWaitingListCount?: number | null, dataSource?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, hasRegistrationUserAccess?: boolean | null, hasSubstituteUserAccess?: boolean | null, isCreatedByCurrentUser?: boolean | null, lastModifiedTime?: string | null, mandatoryFields?: Array<string | null> | null, maximumAttendeeCapacity?: number | null, maximumGroupSize?: number | null, minimumAttendeeCapacity?: number | null, remainingAttendeeCapacity?: number | null, remainingWaitingListCapacity?: number | null, publisher?: string | null, waitingListCapacity?: number | null, confirmationMessage?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, event?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, instructions?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registrationAccount?: { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null, registrationMerchant?: { __typename?: 'RegistrationMerchant', merchant?: number | null } | null, registrationPriceGroups?: Array<{ __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, registrationUserAccesses?: Array<{ __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null } | null> | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } };

export type SendRegistrationUserAccessInvitationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SendRegistrationUserAccessInvitationMutation = { __typename?: 'Mutation', sendRegistrationUserAccessInvitation?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type RegistrationsQueryVariables = Exact<{
  adminUser?: InputMaybe<Scalars['Boolean']['input']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>> | InputMaybe<EventTypeId>>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type RegistrationsQuery = { __typename?: 'Query', registrations: { __typename?: 'RegistrationsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Registration', id?: string | null, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, currentAttendeeCount?: number | null, currentWaitingListCount?: number | null, dataSource?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, hasRegistrationUserAccess?: boolean | null, hasSubstituteUserAccess?: boolean | null, isCreatedByCurrentUser?: boolean | null, lastModifiedTime?: string | null, mandatoryFields?: Array<string | null> | null, maximumAttendeeCapacity?: number | null, maximumGroupSize?: number | null, minimumAttendeeCapacity?: number | null, remainingAttendeeCapacity?: number | null, remainingWaitingListCapacity?: number | null, publisher?: string | null, waitingListCapacity?: number | null, confirmationMessage?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, event?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null, audienceMinAge?: number | null, createdBy?: string | null, deleted?: string | null, endTime?: string | null, enrolmentEndTime?: string | null, enrolmentStartTime?: string | null, environment?: string | null, environmentalCertificate?: string | null, eventStatus?: EventStatus | null, lastModifiedTime?: string | null, maximumAttendeeCapacity?: number | null, minimumAttendeeCapacity?: number | null, publicationStatus?: PublicationStatus | null, publisher?: string | null, startTime?: string | null, superEventType?: SuperEventType | null, typeId?: EventTypeId | null, userConsent?: boolean | null, userEmail?: string | null, userName?: string | null, userOrganization?: string | null, userPhoneNumber?: string | null, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null>, audience: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null, link?: string | null } | null>, images: Array<{ __typename?: 'Image', id?: string | null, atId: string, altText?: string | null, lastModifiedTime?: string | null, license?: string | null, name?: string | null, photographerName?: string | null, publisher?: string | null, url?: string | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, inLanguage: Array<{ __typename?: 'Language', id?: string | null, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, atId: string, dataSource?: string | null, deprecated?: boolean | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, replacedBy?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, location?: { __typename?: 'Place', id?: string | null, atId: string, addressRegion?: string | null, contactType?: string | null, dataSource?: string | null, email?: string | null, hasUpcomingEvents?: boolean | null, nEvents?: number | null, publisher?: string | null, postalCode?: string | null, postOfficeBoxNum?: string | null, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, divisions: Array<{ __typename?: 'Division', type?: string | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, position?: { __typename?: 'Position', coordinates: Array<number | null> } | null } | null, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, name?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, offerPriceGroups?: Array<{ __typename?: 'OfferPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, price?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null>, provider?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registration?: { __typename?: 'IdObject', atId?: string | null } | null, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, videos: Array<{ __typename?: 'Video', altText?: string | null, name?: string | null, url?: string | null } | null> } | null, instructions?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null, registrationAccount?: { __typename?: 'RegistrationAccount', account?: number | null, balanceProfitCenter?: string | null, companyCode?: string | null, internalOrder?: string | null, mainLedgerAccount?: string | null, operationArea?: string | null, profitCenter?: string | null, project?: string | null } | null, registrationMerchant?: { __typename?: 'RegistrationMerchant', merchant?: number | null } | null, registrationPriceGroups?: Array<{ __typename?: 'RegistrationPriceGroup', id?: number | null, price?: string | null, vatPercentage?: string | null, priceWithoutVat?: string | null, vat?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null> | null, registrationUserAccesses?: Array<{ __typename?: 'RegistrationUserAccess', email?: string | null, id?: number | null, isSubstituteUser?: boolean | null, language?: string | null } | null> | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } | null> } };

export type CreateSeatsReservationMutationVariables = Exact<{
  input: CreateSeatsReservationMutationInput;
}>;


export type CreateSeatsReservationMutation = { __typename?: 'Mutation', createSeatsReservation: { __typename?: 'SeatsReservation', id: string, code: string, expiration: string, inWaitlist: boolean, registration: string, seats: number, timestamp: string } };

export type UpdateSeatsReservationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSeatsReservationMutationInput;
}>;


export type UpdateSeatsReservationMutation = { __typename?: 'Mutation', updateSeatsReservation: { __typename?: 'SeatsReservation', id: string, code: string, expiration: string, inWaitlist: boolean, registration: string, seats: number, timestamp: string } };

export type SeatsReservationFieldsFragment = { __typename?: 'SeatsReservation', id: string, code: string, expiration: string, inWaitlist: boolean, registration: string, seats: number, timestamp: string };

export type CreateSignupsMutationVariables = Exact<{
  input: CreateSignupsMutationInput;
}>;


export type CreateSignupsMutation = { __typename?: 'Mutation', createSignups: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null }> };

export type DeleteSignupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSignupMutation = { __typename?: 'Mutation', deleteSignup?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateSignupMutationVariables = Exact<{
  input: UpdateSignupMutationInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateSignupMutation = { __typename?: 'Mutation', updateSignup: { __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } };

export type PatchSignupMutationVariables = Exact<{
  input: UpdateSignupMutationInput;
  id: Scalars['ID']['input'];
}>;


export type PatchSignupMutation = { __typename?: 'Mutation', updateSignup: { __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageMutationInput;
  registration: Scalars['ID']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: { __typename?: 'SendMessageResponse', htmlMessage: string, message: string, signups?: Array<string> | null, subject: string } | null };

export type SignupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SignupQuery = { __typename?: 'Query', signup: { __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } };

export type ContactPersonFieldsFragment = { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null };

export type SignupPriceGroupFieldsFragment = { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null };

export type SignupFieldsFragment = { __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null };

export type CreateSignupGroupMutationVariables = Exact<{
  input: CreateSignupGroupMutationInput;
}>;


export type CreateSignupGroupMutation = { __typename?: 'Mutation', createSignupGroup: { __typename?: 'CreateSignupGroupResponse', extraInfo?: string | null, id?: string | null, registration?: string | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null }> | null } };

export type DeleteSignupGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSignupGroupMutation = { __typename?: 'Mutation', deleteSignupGroup?: { __typename?: 'NoContent', noContent?: boolean | null } | null };

export type UpdateSignupGroupMutationVariables = Exact<{
  input: UpdateSignupGroupMutationInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateSignupGroupMutation = { __typename?: 'Mutation', updateSignupGroup: { __typename?: 'SignupGroup', extraInfo?: string | null, id?: string | null, registration?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } };

export type CreateSignupGroupFieldsFragment = { __typename?: 'CreateSignupGroupResponse', extraInfo?: string | null, id?: string | null, registration?: string | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null }> | null };

export type SignupGroupFieldsFragment = { __typename?: 'SignupGroup', extraInfo?: string | null, id?: string | null, registration?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null };

export type SignupGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SignupGroupQuery = { __typename?: 'Query', signupGroup: { __typename?: 'SignupGroup', extraInfo?: string | null, id?: string | null, registration?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, signups?: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null } | null> | null } };

export type SignupsQueryVariables = Exact<{
  attendeeStatus?: InputMaybe<AttendeeStatus>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  registration?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type SignupsQuery = { __typename?: 'Query', signups: { __typename?: 'SignupsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Signup', attendeeStatus?: AttendeeStatus | null, city?: string | null, dateOfBirth?: string | null, extraInfo?: string | null, firstName?: string | null, id: string, lastName?: string | null, phoneNumber?: string | null, presenceStatus?: PresenceStatus | null, signupGroup?: string | null, streetAddress?: string | null, zipcode?: string | null, contactPerson?: { __typename?: 'ContactPerson', email?: string | null, firstName?: string | null, id: string, lastName?: string | null, membershipNumber?: string | null, nativeLanguage?: string | null, notifications?: string | null, phoneNumber?: string | null, serviceLanguage?: string | null } | null, priceGroup?: { __typename?: 'SignupPriceGroup', id?: number | null, price?: string | null, priceWithoutVat?: string | null, registrationPriceGroup?: number | null, vat?: string | null, vatPercentage?: string | null, priceGroup?: { __typename?: 'PriceGroupDense', id: number, description?: { __typename?: 'LocalisedObject', ar?: string | null, en?: string | null, fi?: string | null, ru?: string | null, sv?: string | null, zhHans?: string | null } | null } | null } | null }> } };

export type UserFieldsFragment = { __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null };

export type UserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  createPath?: InputMaybe<Scalars['Any']['input']>;
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } };

export type UsersQueryVariables = Exact<{
  createPath?: InputMaybe<Scalars['Any']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersResponse', meta: { __typename?: 'Meta', count: number, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null, departmentName?: string | null, displayName?: string | null, email?: string | null, financialAdminOrganizations: Array<string>, firstName?: string | null, isExternal?: boolean | null, isStaff?: boolean | null, isSubstituteUser?: boolean | null, isSuperuser?: boolean | null, lastLogin?: string | null, lastName?: string | null, organization?: string | null, organizationMemberships: Array<string>, registrationAdminOrganizations: Array<string>, username?: string | null, uuid?: string | null } | null> } };

export const DataSourceFieldsFragmentDoc = gql`
    fragment dataSourceFields on DataSource {
  apiKey
  createPastEvents
  editPastEvents
  id
  name
  owner
  private
  userEditable
}
    `;
export const FeedbackFieldsFragmentDoc = gql`
    fragment feedbackFields on Feedback {
  id
  name
  email
  subject
  body
}
    `;
export const MetaFieldsFragmentDoc = gql`
    fragment metaFields on Meta {
  count
  next
  previous
}
    `;
export const LocalisedFieldsFragmentDoc = gql`
    fragment localisedFields on LocalisedObject {
  ar
  en
  fi
  ru
  sv
  zhHans
}
    `;
export const KeywordFieldsFragmentDoc = gql`
    fragment keywordFields on Keyword {
  id
  atId
  dataSource
  deprecated
  hasUpcomingEvents
  name {
    ...localisedFields
  }
  nEvents
  publisher
  replacedBy
}
    ${LocalisedFieldsFragmentDoc}`;
export const KeywordSetFieldsFragmentDoc = gql`
    fragment keywordSetFields on KeywordSet {
  id
  atId
  dataSource
  keywords {
    ...keywordFields
  }
  name {
    ...localisedFields
  }
  organization
  usage
}
    ${KeywordFieldsFragmentDoc}
${LocalisedFieldsFragmentDoc}`;
export const UserFieldsFragmentDoc = gql`
    fragment userFields on User {
  adminOrganizations
  dateJoined
  departmentName
  displayName
  email
  financialAdminOrganizations
  firstName
  isExternal
  isStaff
  isSubstituteUser
  isSuperuser
  lastLogin
  lastName
  organization
  organizationMemberships
  registrationAdminOrganizations
  username
  uuid
}
    `;
export const WebStoreAccountFieldsFragmentDoc = gql`
    fragment webStoreAccountFields on WebStoreAccount {
  active
  balanceProfitCenter
  companyCode
  id
  internalOrder
  mainLedgerAccount
  name
  operationArea
  profitCenter
  project
}
    `;
export const WebStoreMerchantFieldsFragmentDoc = gql`
    fragment webStoreMerchantFields on WebStoreMerchant {
  active
  businessId
  city
  email
  id
  merchantId
  name
  paytrailMerchantId
  phoneNumber
  streetAddress
  termsOfServiceUrl
  zipcode
}
    `;
export const OrganizationFieldsFragmentDoc = gql`
    fragment organizationFields on Organization {
  adminUsers {
    ...userFields
  }
  affiliatedOrganizations
  atId
  classification
  createdTime
  dataSource
  dissolutionDate
  financialAdminUsers {
    ...userFields
  }
  foundingDate
  hasRegularUsers
  id
  isAffiliated
  lastModifiedTime
  name
  parentOrganization
  registrationAdminUsers {
    ...userFields
  }
  regularUsers {
    ...userFields
  }
  replacedBy
  subOrganizations
  webStoreAccounts {
    ...webStoreAccountFields
  }
  webStoreMerchants {
    ...webStoreMerchantFields
  }
}
    ${UserFieldsFragmentDoc}
${WebStoreAccountFieldsFragmentDoc}
${WebStoreMerchantFieldsFragmentDoc}`;
export const OrganizationClassFieldsFragmentDoc = gql`
    fragment organizationClassFields on OrganizationClass {
  createdTime
  dataSource
  id
  lastModifiedTime
  name
}
    `;
export const PriceGroupFieldsFragmentDoc = gql`
    fragment priceGroupFields on PriceGroup {
  id
  description {
    ...localisedFields
  }
  isFree
  publisher
}
    ${LocalisedFieldsFragmentDoc}`;
export const ExternalLinkFieldsFragmentDoc = gql`
    fragment externalLinkFields on ExternalLink {
  name
  link
}
    `;
export const ImageFieldsFragmentDoc = gql`
    fragment imageFields on Image {
  id
  atId
  altText
  lastModifiedTime
  license
  name
  photographerName
  publisher
  url
}
    `;
export const LanguageFieldsFragmentDoc = gql`
    fragment languageFields on Language {
  id
  atId
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const DivisionFieldsFragmentDoc = gql`
    fragment divisionFields on Division {
  type
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const PositionFieldsFragmentDoc = gql`
    fragment positionFields on Position {
  coordinates
}
    `;
export const PlaceFieldsFragmentDoc = gql`
    fragment placeFields on Place {
  id
  atId
  addressLocality {
    ...localisedFields
  }
  addressRegion
  contactType
  dataSource
  description {
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
  name {
    ...localisedFields
  }
  nEvents
  publisher
  postalCode
  postOfficeBoxNum
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
    ${LocalisedFieldsFragmentDoc}
${DivisionFieldsFragmentDoc}
${PositionFieldsFragmentDoc}`;
export const DensePriceGroupFieldsFragmentDoc = gql`
    fragment densePriceGroupFields on PriceGroupDense {
  id
  description {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const OfferPriceGroupFieldsFragmentDoc = gql`
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
    ${DensePriceGroupFieldsFragmentDoc}`;
export const OfferFieldsFragmentDoc = gql`
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
    ${LocalisedFieldsFragmentDoc}
${OfferPriceGroupFieldsFragmentDoc}`;
export const IdObjectFieldsFragmentDoc = gql`
    fragment idObjectFields on IdObject {
  atId
}
    `;
export const VideoFieldsFragmentDoc = gql`
    fragment videoFields on Video {
  altText
  name
  url
}
    `;
export const BaseEventFieldsFragmentDoc = gql`
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
    ${KeywordFieldsFragmentDoc}
${LocalisedFieldsFragmentDoc}
${ExternalLinkFieldsFragmentDoc}
${ImageFieldsFragmentDoc}
${LanguageFieldsFragmentDoc}
${PlaceFieldsFragmentDoc}
${OfferFieldsFragmentDoc}
${IdObjectFieldsFragmentDoc}
${VideoFieldsFragmentDoc}`;
export const EventFieldsFragmentDoc = gql`
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
    ${BaseEventFieldsFragmentDoc}`;
export const RegistrationAccountFieldsFragmentDoc = gql`
    fragment registrationAccountFields on RegistrationAccount {
  account
  balanceProfitCenter
  companyCode
  internalOrder
  mainLedgerAccount
  operationArea
  profitCenter
  project
}
    `;
export const RegistrationMerchantFieldsFragmentDoc = gql`
    fragment registrationMerchantFields on RegistrationMerchant {
  merchant
}
    `;
export const RegistrationPriceGroupFieldsFragmentDoc = gql`
    fragment registrationPriceGroupFields on RegistrationPriceGroup {
  id
  priceGroup {
    ...densePriceGroupFields
  }
  price
  vatPercentage
  priceWithoutVat
  vat
}
    ${DensePriceGroupFieldsFragmentDoc}`;
export const RegistrationUserAccessFieldsFragmentDoc = gql`
    fragment registrationUserAccessFields on RegistrationUserAccess {
  email
  id
  isSubstituteUser
  language
}
    `;
export const ContactPersonFieldsFragmentDoc = gql`
    fragment contactPersonFields on ContactPerson {
  email
  firstName
  id
  lastName
  membershipNumber
  nativeLanguage
  notifications
  phoneNumber
  serviceLanguage
}
    `;
export const SignupPriceGroupFieldsFragmentDoc = gql`
    fragment signupPriceGroupFields on SignupPriceGroup {
  id
  priceGroup {
    ...densePriceGroupFields
  }
  price
  priceWithoutVat
  registrationPriceGroup
  vat
  vatPercentage
}
    ${DensePriceGroupFieldsFragmentDoc}`;
export const SignupFieldsFragmentDoc = gql`
    fragment signupFields on Signup {
  attendeeStatus
  city
  contactPerson {
    ...contactPersonFields
  }
  dateOfBirth
  extraInfo
  firstName
  id
  lastName
  phoneNumber
  priceGroup {
    ...signupPriceGroupFields
  }
  presenceStatus
  signupGroup
  streetAddress
  zipcode
}
    ${ContactPersonFieldsFragmentDoc}
${SignupPriceGroupFieldsFragmentDoc}`;
export const RegistrationFieldsFragmentDoc = gql`
    fragment registrationFields on Registration {
  id
  atId
  audienceMaxAge
  audienceMinAge
  confirmationMessage {
    ...localisedFields
  }
  createdBy
  currentAttendeeCount
  currentWaitingListCount
  dataSource
  enrolmentEndTime
  enrolmentStartTime
  event {
    ...eventFields
  }
  hasRegistrationUserAccess
  hasSubstituteUserAccess
  instructions {
    ...localisedFields
  }
  isCreatedByCurrentUser
  lastModifiedTime
  mandatoryFields
  maximumAttendeeCapacity
  maximumGroupSize
  minimumAttendeeCapacity
  remainingAttendeeCapacity
  remainingWaitingListCapacity
  publisher
  registrationAccount {
    ...registrationAccountFields
  }
  registrationMerchant {
    ...registrationMerchantFields
  }
  registrationPriceGroups {
    ...registrationPriceGroupFields
  }
  registrationUserAccesses {
    ...registrationUserAccessFields
  }
  signups {
    ...signupFields
  }
  waitingListCapacity
}
    ${LocalisedFieldsFragmentDoc}
${EventFieldsFragmentDoc}
${RegistrationAccountFieldsFragmentDoc}
${RegistrationMerchantFieldsFragmentDoc}
${RegistrationPriceGroupFieldsFragmentDoc}
${RegistrationUserAccessFieldsFragmentDoc}
${SignupFieldsFragmentDoc}`;
export const SeatsReservationFieldsFragmentDoc = gql`
    fragment seatsReservationFields on SeatsReservation {
  id
  code
  expiration
  inWaitlist
  registration
  seats
  timestamp
}
    `;
export const CreateSignupGroupFieldsFragmentDoc = gql`
    fragment createSignupGroupFields on CreateSignupGroupResponse {
  extraInfo
  id
  registration
  signups {
    ...signupFields
  }
}
    ${SignupFieldsFragmentDoc}`;
export const SignupGroupFieldsFragmentDoc = gql`
    fragment signupGroupFields on SignupGroup {
  contactPerson {
    ...contactPersonFields
  }
  extraInfo
  id
  registration
  signups {
    ...signupFields
  }
}
    ${ContactPersonFieldsFragmentDoc}
${SignupFieldsFragmentDoc}`;
export const DataSourceDocument = gql`
    query DataSource($id: ID!, $createPath: Any) {
  dataSource(id: $id) @rest(type: "DataSource", pathBuilder: $createPath) {
    ...dataSourceFields
  }
}
    ${DataSourceFieldsFragmentDoc}`;

/**
 * __useDataSourceQuery__
 *
 * To run a query within a React component, call `useDataSourceQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataSourceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataSourceQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useDataSourceQuery(baseOptions: Apollo.QueryHookOptions<DataSourceQuery, DataSourceQueryVariables> & ({ variables: DataSourceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DataSourceQuery, DataSourceQueryVariables>(DataSourceDocument, options);
      }
export function useDataSourceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DataSourceQuery, DataSourceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DataSourceQuery, DataSourceQueryVariables>(DataSourceDocument, options);
        }
export function useDataSourceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DataSourceQuery, DataSourceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DataSourceQuery, DataSourceQueryVariables>(DataSourceDocument, options);
        }
export type DataSourceQueryHookResult = ReturnType<typeof useDataSourceQuery>;
export type DataSourceLazyQueryHookResult = ReturnType<typeof useDataSourceLazyQuery>;
export type DataSourceSuspenseQueryHookResult = ReturnType<typeof useDataSourceSuspenseQuery>;
export type DataSourceQueryResult = Apollo.QueryResult<DataSourceQuery, DataSourceQueryVariables>;
export const DataSourcesDocument = gql`
    query DataSources($createPath: Any, $page: Int, $pageSize: Int) {
  dataSources(page: $page, pageSize: $pageSize) @rest(type: "DataSourcesResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...dataSourceFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${DataSourceFieldsFragmentDoc}`;

/**
 * __useDataSourcesQuery__
 *
 * To run a query within a React component, call `useDataSourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataSourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataSourcesQuery({
 *   variables: {
 *      createPath: // value for 'createPath'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useDataSourcesQuery(baseOptions?: Apollo.QueryHookOptions<DataSourcesQuery, DataSourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DataSourcesQuery, DataSourcesQueryVariables>(DataSourcesDocument, options);
      }
export function useDataSourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DataSourcesQuery, DataSourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DataSourcesQuery, DataSourcesQueryVariables>(DataSourcesDocument, options);
        }
export function useDataSourcesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DataSourcesQuery, DataSourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DataSourcesQuery, DataSourcesQueryVariables>(DataSourcesDocument, options);
        }
export type DataSourcesQueryHookResult = ReturnType<typeof useDataSourcesQuery>;
export type DataSourcesLazyQueryHookResult = ReturnType<typeof useDataSourcesLazyQuery>;
export type DataSourcesSuspenseQueryHookResult = ReturnType<typeof useDataSourcesSuspenseQuery>;
export type DataSourcesQueryResult = Apollo.QueryResult<DataSourcesQuery, DataSourcesQueryVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: CreateEventMutationInput!) {
  createEvent(input: $input) @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id) @rest(type: "NoContent", path: "/event/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($id: ID!, $input: UpdateEventMutationInput!) {
  updateEvent(id: $id, input: $input) @rest(type: "Event", path: "/event/{args.id}/", method: "PUT", bodyKey: "input") {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const CreateEventsDocument = gql`
    mutation CreateEvents($input: [CreateEventMutationInput!]!) {
  createEvents(input: $input) @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateEventsMutationFn = Apollo.MutationFunction<CreateEventsMutation, CreateEventsMutationVariables>;

/**
 * __useCreateEventsMutation__
 *
 * To run a mutation, you first call `useCreateEventsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventsMutation, { data, loading, error }] = useCreateEventsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventsMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventsMutation, CreateEventsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventsMutation, CreateEventsMutationVariables>(CreateEventsDocument, options);
      }
export type CreateEventsMutationHookResult = ReturnType<typeof useCreateEventsMutation>;
export type CreateEventsMutationResult = Apollo.MutationResult<CreateEventsMutation>;
export type CreateEventsMutationOptions = Apollo.BaseMutationOptions<CreateEventsMutation, CreateEventsMutationVariables>;
export const UpdateEventsDocument = gql`
    mutation UpdateEvents($input: [UpdateEventMutationInput!]!) {
  updateEvents(input: $input) @rest(type: "Event", path: "/event/", method: "PUT", bodyKey: "input") {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventsMutationFn = Apollo.MutationFunction<UpdateEventsMutation, UpdateEventsMutationVariables>;

/**
 * __useUpdateEventsMutation__
 *
 * To run a mutation, you first call `useUpdateEventsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventsMutation, { data, loading, error }] = useUpdateEventsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventsMutation, UpdateEventsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventsMutation, UpdateEventsMutationVariables>(UpdateEventsDocument, options);
      }
export type UpdateEventsMutationHookResult = ReturnType<typeof useUpdateEventsMutation>;
export type UpdateEventsMutationResult = Apollo.MutationResult<UpdateEventsMutation>;
export type UpdateEventsMutationOptions = Apollo.BaseMutationOptions<UpdateEventsMutation, UpdateEventsMutationVariables>;
export const EventDocument = gql`
    query Event($id: ID!, $include: [String], $createPath: Any) {
  event(id: $id, include: $include) @rest(type: "Event", pathBuilder: $createPath) {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *      include: // value for 'include'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables> & ({ variables: EventQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, options);
      }
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, options);
        }
export function useEventSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventQuery, EventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventQuery, EventQueryVariables>(EventDocument, options);
        }
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventSuspenseQueryHookResult = ReturnType<typeof useEventSuspenseQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const EventsDocument = gql`
    query Events($adminUser: Boolean, $createdBy: String, $combinedText: [String], $division: [String], $end: String, $endsAfter: String, $endsBefore: String, $eventType: [EventTypeId], $include: [String], $inLanguage: String, $isFree: Boolean, $keyword: [String], $keywordAnd: [String], $keywordNot: [String], $language: String, $location: [String], $page: Int, $pageSize: Int, $publicationStatus: PublicationStatus, $publisher: [String], $registration: Boolean, $registrationAdminUser: Boolean, $showAll: Boolean, $sort: String, $start: String, $startsAfter: String, $startsBefore: String, $superEvent: ID, $superEventType: [String], $text: String, $translation: String, $createPath: Any) {
  events(
    adminUser: $adminUser
    createdBy: $createdBy
    combinedText: $combinedText
    division: $division
    end: $end
    endsAfter: $endsAfter
    endsBefore: $endsBefore
    eventType: $eventType
    include: $include
    inLanguage: $inLanguage
    isFree: $isFree
    keyword: $keyword
    keywordAnd: $keywordAnd
    keywordNot: $keywordNot
    language: $language
    location: $location
    page: $page
    pageSize: $pageSize
    publicationStatus: $publicationStatus
    publisher: $publisher
    registration: $registration
    registrationAdminUser: $registrationAdminUser
    showAll: $showAll
    sort: $sort
    start: $start
    startsAfter: $startsAfter
    startsBefore: $startsBefore
    superEvent: $superEvent
    superEventType: $superEventType
    text: $text
    translation: $translation
  ) @rest(type: "EventsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...eventFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${EventFieldsFragmentDoc}`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *      adminUser: // value for 'adminUser'
 *      createdBy: // value for 'createdBy'
 *      combinedText: // value for 'combinedText'
 *      division: // value for 'division'
 *      end: // value for 'end'
 *      endsAfter: // value for 'endsAfter'
 *      endsBefore: // value for 'endsBefore'
 *      eventType: // value for 'eventType'
 *      include: // value for 'include'
 *      inLanguage: // value for 'inLanguage'
 *      isFree: // value for 'isFree'
 *      keyword: // value for 'keyword'
 *      keywordAnd: // value for 'keywordAnd'
 *      keywordNot: // value for 'keywordNot'
 *      language: // value for 'language'
 *      location: // value for 'location'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publicationStatus: // value for 'publicationStatus'
 *      publisher: // value for 'publisher'
 *      registration: // value for 'registration'
 *      registrationAdminUser: // value for 'registrationAdminUser'
 *      showAll: // value for 'showAll'
 *      sort: // value for 'sort'
 *      start: // value for 'start'
 *      startsAfter: // value for 'startsAfter'
 *      startsBefore: // value for 'startsBefore'
 *      superEvent: // value for 'superEvent'
 *      superEventType: // value for 'superEventType'
 *      text: // value for 'text'
 *      translation: // value for 'translation'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export function useEventsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsSuspenseQueryHookResult = ReturnType<typeof useEventsSuspenseQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const PostFeedbackDocument = gql`
    mutation PostFeedback($input: FeedbackInput!) {
  postFeedback(input: $input) @rest(type: "Feedback", path: "/feedback/", method: "POST", bodyKey: "input") {
    ...feedbackFields
  }
}
    ${FeedbackFieldsFragmentDoc}`;
export type PostFeedbackMutationFn = Apollo.MutationFunction<PostFeedbackMutation, PostFeedbackMutationVariables>;

/**
 * __usePostFeedbackMutation__
 *
 * To run a mutation, you first call `usePostFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postFeedbackMutation, { data, loading, error }] = usePostFeedbackMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostFeedbackMutation(baseOptions?: Apollo.MutationHookOptions<PostFeedbackMutation, PostFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostFeedbackMutation, PostFeedbackMutationVariables>(PostFeedbackDocument, options);
      }
export type PostFeedbackMutationHookResult = ReturnType<typeof usePostFeedbackMutation>;
export type PostFeedbackMutationResult = Apollo.MutationResult<PostFeedbackMutation>;
export type PostFeedbackMutationOptions = Apollo.BaseMutationOptions<PostFeedbackMutation, PostFeedbackMutationVariables>;
export const PostGuestFeedbackDocument = gql`
    mutation PostGuestFeedback($input: FeedbackInput!) {
  postGuestFeedback(input: $input) @rest(type: "Feedback", path: "/guest-feedback/", method: "POST", bodyKey: "input") {
    ...feedbackFields
  }
}
    ${FeedbackFieldsFragmentDoc}`;
export type PostGuestFeedbackMutationFn = Apollo.MutationFunction<PostGuestFeedbackMutation, PostGuestFeedbackMutationVariables>;

/**
 * __usePostGuestFeedbackMutation__
 *
 * To run a mutation, you first call `usePostGuestFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostGuestFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postGuestFeedbackMutation, { data, loading, error }] = usePostGuestFeedbackMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostGuestFeedbackMutation(baseOptions?: Apollo.MutationHookOptions<PostGuestFeedbackMutation, PostGuestFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostGuestFeedbackMutation, PostGuestFeedbackMutationVariables>(PostGuestFeedbackDocument, options);
      }
export type PostGuestFeedbackMutationHookResult = ReturnType<typeof usePostGuestFeedbackMutation>;
export type PostGuestFeedbackMutationResult = Apollo.MutationResult<PostGuestFeedbackMutation>;
export type PostGuestFeedbackMutationOptions = Apollo.BaseMutationOptions<PostGuestFeedbackMutation, PostGuestFeedbackMutationVariables>;
export const DeleteImageDocument = gql`
    mutation DeleteImage($id: ID!) {
  deleteImage(id: $id) @rest(type: "NoContent", path: "/image/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteImageMutationFn = Apollo.MutationFunction<DeleteImageMutation, DeleteImageMutationVariables>;

/**
 * __useDeleteImageMutation__
 *
 * To run a mutation, you first call `useDeleteImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteImageMutation, { data, loading, error }] = useDeleteImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteImageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteImageMutation, DeleteImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteImageMutation, DeleteImageMutationVariables>(DeleteImageDocument, options);
      }
export type DeleteImageMutationHookResult = ReturnType<typeof useDeleteImageMutation>;
export type DeleteImageMutationResult = Apollo.MutationResult<DeleteImageMutation>;
export type DeleteImageMutationOptions = Apollo.BaseMutationOptions<DeleteImageMutation, DeleteImageMutationVariables>;
export const UpdateImageDocument = gql`
    mutation UpdateImage($id: ID!, $input: UpdateImageMutationInput!) {
  updateImage(id: $id, input: $input) @rest(type: "Image", path: "/image/{args.id}/", method: "PUT", bodyKey: "input") {
    ...imageFields
  }
}
    ${ImageFieldsFragmentDoc}`;
export type UpdateImageMutationFn = Apollo.MutationFunction<UpdateImageMutation, UpdateImageMutationVariables>;

/**
 * __useUpdateImageMutation__
 *
 * To run a mutation, you first call `useUpdateImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateImageMutation, { data, loading, error }] = useUpdateImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateImageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateImageMutation, UpdateImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateImageMutation, UpdateImageMutationVariables>(UpdateImageDocument, options);
      }
export type UpdateImageMutationHookResult = ReturnType<typeof useUpdateImageMutation>;
export type UpdateImageMutationResult = Apollo.MutationResult<UpdateImageMutation>;
export type UpdateImageMutationOptions = Apollo.BaseMutationOptions<UpdateImageMutation, UpdateImageMutationVariables>;
export const UploadImageDocument = gql`
    mutation UploadImage($input: UploadImageMutationInput!) {
  uploadImage(input: $input) @rest(type: "Image", path: "/image/", method: "POST", bodySerializer: "uploadImageSerializer") {
    ...imageFields
  }
}
    ${ImageFieldsFragmentDoc}`;
export type UploadImageMutationFn = Apollo.MutationFunction<UploadImageMutation, UploadImageMutationVariables>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadImageMutation, UploadImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(UploadImageDocument, options);
      }
export type UploadImageMutationHookResult = ReturnType<typeof useUploadImageMutation>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<UploadImageMutation, UploadImageMutationVariables>;
export const ImageDocument = gql`
    query Image($id: ID!, $createPath: Any) {
  image(id: $id) @rest(type: "Image", pathBuilder: $createPath) {
    ...imageFields
  }
}
    ${ImageFieldsFragmentDoc}`;

/**
 * __useImageQuery__
 *
 * To run a query within a React component, call `useImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useImageQuery(baseOptions: Apollo.QueryHookOptions<ImageQuery, ImageQueryVariables> & ({ variables: ImageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
      }
export function useImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImageQuery, ImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
        }
export function useImageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ImageQuery, ImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
        }
export type ImageQueryHookResult = ReturnType<typeof useImageQuery>;
export type ImageLazyQueryHookResult = ReturnType<typeof useImageLazyQuery>;
export type ImageSuspenseQueryHookResult = ReturnType<typeof useImageSuspenseQuery>;
export type ImageQueryResult = Apollo.QueryResult<ImageQuery, ImageQueryVariables>;
export const ImagesDocument = gql`
    query Images($createdBy: String, $dataSource: String, $mergePages: Boolean, $page: Int, $pageSize: Int, $publisher: ID, $sort: String, $text: String, $createPath: Any) {
  images(
    createdBy: $createdBy
    dataSource: $dataSource
    mergePages: $mergePages
    page: $page
    pageSize: $pageSize
    publisher: $publisher
    sort: $sort
    text: $text
  ) @rest(type: "ImagesResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...imageFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${ImageFieldsFragmentDoc}`;

/**
 * __useImagesQuery__
 *
 * To run a query within a React component, call `useImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImagesQuery({
 *   variables: {
 *      createdBy: // value for 'createdBy'
 *      dataSource: // value for 'dataSource'
 *      mergePages: // value for 'mergePages'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useImagesQuery(baseOptions?: Apollo.QueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
      }
export function useImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
        }
export function useImagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
        }
export type ImagesQueryHookResult = ReturnType<typeof useImagesQuery>;
export type ImagesLazyQueryHookResult = ReturnType<typeof useImagesLazyQuery>;
export type ImagesSuspenseQueryHookResult = ReturnType<typeof useImagesSuspenseQuery>;
export type ImagesQueryResult = Apollo.QueryResult<ImagesQuery, ImagesQueryVariables>;
export const CreateKeywordDocument = gql`
    mutation CreateKeyword($input: CreateKeywordMutationInput!) {
  createKeyword(input: $input) @rest(type: "Keyword", path: "/keyword/", method: "POST", bodyKey: "input") {
    ...keywordFields
  }
}
    ${KeywordFieldsFragmentDoc}`;
export type CreateKeywordMutationFn = Apollo.MutationFunction<CreateKeywordMutation, CreateKeywordMutationVariables>;

/**
 * __useCreateKeywordMutation__
 *
 * To run a mutation, you first call `useCreateKeywordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateKeywordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createKeywordMutation, { data, loading, error }] = useCreateKeywordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateKeywordMutation(baseOptions?: Apollo.MutationHookOptions<CreateKeywordMutation, CreateKeywordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateKeywordMutation, CreateKeywordMutationVariables>(CreateKeywordDocument, options);
      }
export type CreateKeywordMutationHookResult = ReturnType<typeof useCreateKeywordMutation>;
export type CreateKeywordMutationResult = Apollo.MutationResult<CreateKeywordMutation>;
export type CreateKeywordMutationOptions = Apollo.BaseMutationOptions<CreateKeywordMutation, CreateKeywordMutationVariables>;
export const DeleteKeywordDocument = gql`
    mutation DeleteKeyword($id: ID!) {
  deleteKeyword(id: $id) @rest(type: "NoContent", path: "/keyword/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteKeywordMutationFn = Apollo.MutationFunction<DeleteKeywordMutation, DeleteKeywordMutationVariables>;

/**
 * __useDeleteKeywordMutation__
 *
 * To run a mutation, you first call `useDeleteKeywordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteKeywordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteKeywordMutation, { data, loading, error }] = useDeleteKeywordMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteKeywordMutation(baseOptions?: Apollo.MutationHookOptions<DeleteKeywordMutation, DeleteKeywordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteKeywordMutation, DeleteKeywordMutationVariables>(DeleteKeywordDocument, options);
      }
export type DeleteKeywordMutationHookResult = ReturnType<typeof useDeleteKeywordMutation>;
export type DeleteKeywordMutationResult = Apollo.MutationResult<DeleteKeywordMutation>;
export type DeleteKeywordMutationOptions = Apollo.BaseMutationOptions<DeleteKeywordMutation, DeleteKeywordMutationVariables>;
export const UpdateKeywordDocument = gql`
    mutation UpdateKeyword($id: ID!, $input: UpdateKeywordMutationInput!) {
  updateKeyword(id: $id, input: $input) @rest(type: "Keyword", path: "/keyword/{args.id}/", method: "PUT", bodyKey: "input") {
    ...keywordFields
  }
}
    ${KeywordFieldsFragmentDoc}`;
export type UpdateKeywordMutationFn = Apollo.MutationFunction<UpdateKeywordMutation, UpdateKeywordMutationVariables>;

/**
 * __useUpdateKeywordMutation__
 *
 * To run a mutation, you first call `useUpdateKeywordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateKeywordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateKeywordMutation, { data, loading, error }] = useUpdateKeywordMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateKeywordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateKeywordMutation, UpdateKeywordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateKeywordMutation, UpdateKeywordMutationVariables>(UpdateKeywordDocument, options);
      }
export type UpdateKeywordMutationHookResult = ReturnType<typeof useUpdateKeywordMutation>;
export type UpdateKeywordMutationResult = Apollo.MutationResult<UpdateKeywordMutation>;
export type UpdateKeywordMutationOptions = Apollo.BaseMutationOptions<UpdateKeywordMutation, UpdateKeywordMutationVariables>;
export const KeywordDocument = gql`
    query Keyword($id: ID!, $createPath: Any) {
  keyword(id: $id) @rest(type: "Keyword", pathBuilder: $createPath) {
    ...keywordFields
  }
}
    ${KeywordFieldsFragmentDoc}`;

/**
 * __useKeywordQuery__
 *
 * To run a query within a React component, call `useKeywordQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useKeywordQuery(baseOptions: Apollo.QueryHookOptions<KeywordQuery, KeywordQueryVariables> & ({ variables: KeywordQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
      }
export function useKeywordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
        }
export function useKeywordSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
        }
export type KeywordQueryHookResult = ReturnType<typeof useKeywordQuery>;
export type KeywordLazyQueryHookResult = ReturnType<typeof useKeywordLazyQuery>;
export type KeywordSuspenseQueryHookResult = ReturnType<typeof useKeywordSuspenseQuery>;
export type KeywordQueryResult = Apollo.QueryResult<KeywordQuery, KeywordQueryVariables>;
export const KeywordsDocument = gql`
    query Keywords($dataSource: [String], $freeText: String, $hasUpcomingEvents: Boolean, $page: Int, $pageSize: Int, $showAllKeywords: Boolean, $sort: String, $text: String, $createPath: Any) {
  keywords(
    dataSource: $dataSource
    freeText: $freeText
    hasUpcomingEvents: $hasUpcomingEvents
    page: $page
    pageSize: $pageSize
    showAllKeywords: $showAllKeywords
    sort: $sort
    text: $text
  ) @rest(type: "KeywordsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...keywordFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${KeywordFieldsFragmentDoc}`;

/**
 * __useKeywordsQuery__
 *
 * To run a query within a React component, call `useKeywordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordsQuery({
 *   variables: {
 *      dataSource: // value for 'dataSource'
 *      freeText: // value for 'freeText'
 *      hasUpcomingEvents: // value for 'hasUpcomingEvents'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      showAllKeywords: // value for 'showAllKeywords'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useKeywordsQuery(baseOptions?: Apollo.QueryHookOptions<KeywordsQuery, KeywordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordsQuery, KeywordsQueryVariables>(KeywordsDocument, options);
      }
export function useKeywordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordsQuery, KeywordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordsQuery, KeywordsQueryVariables>(KeywordsDocument, options);
        }
export function useKeywordsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordsQuery, KeywordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordsQuery, KeywordsQueryVariables>(KeywordsDocument, options);
        }
export type KeywordsQueryHookResult = ReturnType<typeof useKeywordsQuery>;
export type KeywordsLazyQueryHookResult = ReturnType<typeof useKeywordsLazyQuery>;
export type KeywordsSuspenseQueryHookResult = ReturnType<typeof useKeywordsSuspenseQuery>;
export type KeywordsQueryResult = Apollo.QueryResult<KeywordsQuery, KeywordsQueryVariables>;
export const CreateKeywordSetDocument = gql`
    mutation CreateKeywordSet($input: CreateKeywordSetMutationInput!) {
  createKeywordSet(input: $input) @rest(type: "KeywordSet", path: "/keyword_set/", method: "POST", bodyKey: "input") {
    ...keywordSetFields
  }
}
    ${KeywordSetFieldsFragmentDoc}`;
export type CreateKeywordSetMutationFn = Apollo.MutationFunction<CreateKeywordSetMutation, CreateKeywordSetMutationVariables>;

/**
 * __useCreateKeywordSetMutation__
 *
 * To run a mutation, you first call `useCreateKeywordSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateKeywordSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createKeywordSetMutation, { data, loading, error }] = useCreateKeywordSetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateKeywordSetMutation(baseOptions?: Apollo.MutationHookOptions<CreateKeywordSetMutation, CreateKeywordSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateKeywordSetMutation, CreateKeywordSetMutationVariables>(CreateKeywordSetDocument, options);
      }
export type CreateKeywordSetMutationHookResult = ReturnType<typeof useCreateKeywordSetMutation>;
export type CreateKeywordSetMutationResult = Apollo.MutationResult<CreateKeywordSetMutation>;
export type CreateKeywordSetMutationOptions = Apollo.BaseMutationOptions<CreateKeywordSetMutation, CreateKeywordSetMutationVariables>;
export const DeleteKeywordSetDocument = gql`
    mutation DeleteKeywordSet($id: ID!) {
  deleteKeywordSet(id: $id) @rest(type: "NoContent", path: "/keyword_set/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteKeywordSetMutationFn = Apollo.MutationFunction<DeleteKeywordSetMutation, DeleteKeywordSetMutationVariables>;

/**
 * __useDeleteKeywordSetMutation__
 *
 * To run a mutation, you first call `useDeleteKeywordSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteKeywordSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteKeywordSetMutation, { data, loading, error }] = useDeleteKeywordSetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteKeywordSetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteKeywordSetMutation, DeleteKeywordSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteKeywordSetMutation, DeleteKeywordSetMutationVariables>(DeleteKeywordSetDocument, options);
      }
export type DeleteKeywordSetMutationHookResult = ReturnType<typeof useDeleteKeywordSetMutation>;
export type DeleteKeywordSetMutationResult = Apollo.MutationResult<DeleteKeywordSetMutation>;
export type DeleteKeywordSetMutationOptions = Apollo.BaseMutationOptions<DeleteKeywordSetMutation, DeleteKeywordSetMutationVariables>;
export const UpdateKeywordSetDocument = gql`
    mutation UpdateKeywordSet($id: ID!, $input: UpdateKeywordSetMutationInput!) {
  updateKeywordSet(id: $id, input: $input) @rest(type: "KeywordSet", path: "/keyword_set/{args.id}/", method: "PUT", bodyKey: "input") {
    ...keywordSetFields
  }
}
    ${KeywordSetFieldsFragmentDoc}`;
export type UpdateKeywordSetMutationFn = Apollo.MutationFunction<UpdateKeywordSetMutation, UpdateKeywordSetMutationVariables>;

/**
 * __useUpdateKeywordSetMutation__
 *
 * To run a mutation, you first call `useUpdateKeywordSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateKeywordSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateKeywordSetMutation, { data, loading, error }] = useUpdateKeywordSetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateKeywordSetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateKeywordSetMutation, UpdateKeywordSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateKeywordSetMutation, UpdateKeywordSetMutationVariables>(UpdateKeywordSetDocument, options);
      }
export type UpdateKeywordSetMutationHookResult = ReturnType<typeof useUpdateKeywordSetMutation>;
export type UpdateKeywordSetMutationResult = Apollo.MutationResult<UpdateKeywordSetMutation>;
export type UpdateKeywordSetMutationOptions = Apollo.BaseMutationOptions<UpdateKeywordSetMutation, UpdateKeywordSetMutationVariables>;
export const KeywordSetDocument = gql`
    query KeywordSet($id: ID!, $include: [String], $createPath: Any) {
  keywordSet(id: $id, include: $include) @rest(type: "KeywordSet", pathBuilder: $createPath) {
    ...keywordSetFields
  }
}
    ${KeywordSetFieldsFragmentDoc}`;

/**
 * __useKeywordSetQuery__
 *
 * To run a query within a React component, call `useKeywordSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordSetQuery({
 *   variables: {
 *      id: // value for 'id'
 *      include: // value for 'include'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useKeywordSetQuery(baseOptions: Apollo.QueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables> & ({ variables: KeywordSetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
      }
export function useKeywordSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
        }
export function useKeywordSetSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
        }
export type KeywordSetQueryHookResult = ReturnType<typeof useKeywordSetQuery>;
export type KeywordSetLazyQueryHookResult = ReturnType<typeof useKeywordSetLazyQuery>;
export type KeywordSetSuspenseQueryHookResult = ReturnType<typeof useKeywordSetSuspenseQuery>;
export type KeywordSetQueryResult = Apollo.QueryResult<KeywordSetQuery, KeywordSetQueryVariables>;
export const KeywordSetsDocument = gql`
    query KeywordSets($include: [String], $page: Int, $pageSize: Int, $sort: String, $text: String, $createPath: Any) {
  keywordSets(
    include: $include
    page: $page
    pageSize: $pageSize
    sort: $sort
    text: $text
  ) @rest(type: "KeywordSetsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...keywordSetFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${KeywordSetFieldsFragmentDoc}`;

/**
 * __useKeywordSetsQuery__
 *
 * To run a query within a React component, call `useKeywordSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordSetsQuery({
 *   variables: {
 *      include: // value for 'include'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useKeywordSetsQuery(baseOptions?: Apollo.QueryHookOptions<KeywordSetsQuery, KeywordSetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordSetsQuery, KeywordSetsQueryVariables>(KeywordSetsDocument, options);
      }
export function useKeywordSetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordSetsQuery, KeywordSetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordSetsQuery, KeywordSetsQueryVariables>(KeywordSetsDocument, options);
        }
export function useKeywordSetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordSetsQuery, KeywordSetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordSetsQuery, KeywordSetsQueryVariables>(KeywordSetsDocument, options);
        }
export type KeywordSetsQueryHookResult = ReturnType<typeof useKeywordSetsQuery>;
export type KeywordSetsLazyQueryHookResult = ReturnType<typeof useKeywordSetsLazyQuery>;
export type KeywordSetsSuspenseQueryHookResult = ReturnType<typeof useKeywordSetsSuspenseQuery>;
export type KeywordSetsQueryResult = Apollo.QueryResult<KeywordSetsQuery, KeywordSetsQueryVariables>;
export const LanguagesDocument = gql`
    query Languages($serviceLanguage: Boolean, $createPath: Any) {
  languages(serviceLanguage: $serviceLanguage) @rest(type: "LanguagesResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...languageFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${LanguageFieldsFragmentDoc}`;

/**
 * __useLanguagesQuery__
 *
 * To run a query within a React component, call `useLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesQuery({
 *   variables: {
 *      serviceLanguage: // value for 'serviceLanguage'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, options);
      }
export function useLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, options);
        }
export function useLanguagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, options);
        }
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>;
export type LanguagesLazyQueryHookResult = ReturnType<typeof useLanguagesLazyQuery>;
export type LanguagesSuspenseQueryHookResult = ReturnType<typeof useLanguagesSuspenseQuery>;
export type LanguagesQueryResult = Apollo.QueryResult<LanguagesQuery, LanguagesQueryVariables>;
export const CreateOrganizationDocument = gql`
    mutation CreateOrganization($input: CreateOrganizationMutationInput!) {
  createOrganization(input: $input) @rest(type: "Organization", path: "/organization/", method: "POST", bodyKey: "input") {
    ...organizationFields
  }
}
    ${OrganizationFieldsFragmentDoc}`;
export type CreateOrganizationMutationFn = Apollo.MutationFunction<CreateOrganizationMutation, CreateOrganizationMutationVariables>;

/**
 * __useCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMutation, { data, loading, error }] = useCreateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationMutation, CreateOrganizationMutationVariables>(CreateOrganizationDocument, options);
      }
export type CreateOrganizationMutationHookResult = ReturnType<typeof useCreateOrganizationMutation>;
export type CreateOrganizationMutationResult = Apollo.MutationResult<CreateOrganizationMutation>;
export type CreateOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const DeleteOrganizationDocument = gql`
    mutation DeleteOrganization($id: ID!) {
  deleteOrganization(id: $id) @rest(type: "NoContent", path: "/organization/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteOrganizationMutationFn = Apollo.MutationFunction<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;

/**
 * __useDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMutation, { data, loading, error }] = useDeleteOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, options);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export const PatchOrganizationDocument = gql`
    mutation PatchOrganization($id: ID!, $input: UpdateOrganizationMutationInput!) {
  patchOrganization(id: $id, input: $input) @rest(type: "Organization", path: "/organization/{args.id}/", method: "PATCH", bodyKey: "input") {
    ...organizationFields
  }
}
    ${OrganizationFieldsFragmentDoc}`;
export type PatchOrganizationMutationFn = Apollo.MutationFunction<PatchOrganizationMutation, PatchOrganizationMutationVariables>;

/**
 * __usePatchOrganizationMutation__
 *
 * To run a mutation, you first call `usePatchOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchOrganizationMutation, { data, loading, error }] = usePatchOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePatchOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<PatchOrganizationMutation, PatchOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PatchOrganizationMutation, PatchOrganizationMutationVariables>(PatchOrganizationDocument, options);
      }
export type PatchOrganizationMutationHookResult = ReturnType<typeof usePatchOrganizationMutation>;
export type PatchOrganizationMutationResult = Apollo.MutationResult<PatchOrganizationMutation>;
export type PatchOrganizationMutationOptions = Apollo.BaseMutationOptions<PatchOrganizationMutation, PatchOrganizationMutationVariables>;
export const UpdateOrganizationDocument = gql`
    mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationMutationInput!) {
  updateOrganization(id: $id, input: $input) @rest(type: "Organization", path: "/organization/{args.id}/", method: "PUT", bodyKey: "input") {
    ...organizationFields
  }
}
    ${OrganizationFieldsFragmentDoc}`;
export type UpdateOrganizationMutationFn = Apollo.MutationFunction<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;

/**
 * __useUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMutation, { data, loading, error }] = useUpdateOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(UpdateOrganizationDocument, options);
      }
export type UpdateOrganizationMutationHookResult = ReturnType<typeof useUpdateOrganizationMutation>;
export type UpdateOrganizationMutationResult = Apollo.MutationResult<UpdateOrganizationMutation>;
export type UpdateOrganizationMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const OrganizationMerchantsDocument = gql`
    query OrganizationMerchants($id: ID!) {
  organizationMerchants(id: $id) @rest(type: "[WebStoreMerchant]", path: "/organization/{args.id}/merchants/") {
    ...webStoreMerchantFields
  }
}
    ${WebStoreMerchantFieldsFragmentDoc}`;

/**
 * __useOrganizationMerchantsQuery__
 *
 * To run a query within a React component, call `useOrganizationMerchantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMerchantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationMerchantsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationMerchantsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables> & ({ variables: OrganizationMerchantsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>(OrganizationMerchantsDocument, options);
      }
export function useOrganizationMerchantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>(OrganizationMerchantsDocument, options);
        }
export function useOrganizationMerchantsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>(OrganizationMerchantsDocument, options);
        }
export type OrganizationMerchantsQueryHookResult = ReturnType<typeof useOrganizationMerchantsQuery>;
export type OrganizationMerchantsLazyQueryHookResult = ReturnType<typeof useOrganizationMerchantsLazyQuery>;
export type OrganizationMerchantsSuspenseQueryHookResult = ReturnType<typeof useOrganizationMerchantsSuspenseQuery>;
export type OrganizationMerchantsQueryResult = Apollo.QueryResult<OrganizationMerchantsQuery, OrganizationMerchantsQueryVariables>;
export const OrganizationAccountsDocument = gql`
    query OrganizationAccounts($id: ID!) {
  organizationAccounts(id: $id) @rest(type: "[WebStoreAccount]", path: "/organization/{args.id}/accounts/") {
    ...webStoreAccountFields
  }
}
    ${WebStoreAccountFieldsFragmentDoc}`;

/**
 * __useOrganizationAccountsQuery__
 *
 * To run a query within a React component, call `useOrganizationAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationAccountsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationAccountsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationAccountsQuery, OrganizationAccountsQueryVariables> & ({ variables: OrganizationAccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>(OrganizationAccountsDocument, options);
      }
export function useOrganizationAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>(OrganizationAccountsDocument, options);
        }
export function useOrganizationAccountsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>(OrganizationAccountsDocument, options);
        }
export type OrganizationAccountsQueryHookResult = ReturnType<typeof useOrganizationAccountsQuery>;
export type OrganizationAccountsLazyQueryHookResult = ReturnType<typeof useOrganizationAccountsLazyQuery>;
export type OrganizationAccountsSuspenseQueryHookResult = ReturnType<typeof useOrganizationAccountsSuspenseQuery>;
export type OrganizationAccountsQueryResult = Apollo.QueryResult<OrganizationAccountsQuery, OrganizationAccountsQueryVariables>;
export const OrganizationDocument = gql`
    query Organization($id: ID!, $createPath: Any, $dissolved: Boolean) {
  organization(id: $id, dissolved: $dissolved) @rest(type: "Organization", pathBuilder: $createPath) {
    ...organizationFields
  }
}
    ${OrganizationFieldsFragmentDoc}`;

/**
 * __useOrganizationQuery__
 *
 * To run a query within a React component, call `useOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *      dissolved: // value for 'dissolved'
 *   },
 * });
 */
export function useOrganizationQuery(baseOptions: Apollo.QueryHookOptions<OrganizationQuery, OrganizationQueryVariables> & ({ variables: OrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationQuery, OrganizationQueryVariables>(OrganizationDocument, options);
      }
export function useOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationQuery, OrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationQuery, OrganizationQueryVariables>(OrganizationDocument, options);
        }
export function useOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationQuery, OrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationQuery, OrganizationQueryVariables>(OrganizationDocument, options);
        }
export type OrganizationQueryHookResult = ReturnType<typeof useOrganizationQuery>;
export type OrganizationLazyQueryHookResult = ReturnType<typeof useOrganizationLazyQuery>;
export type OrganizationSuspenseQueryHookResult = ReturnType<typeof useOrganizationSuspenseQuery>;
export type OrganizationQueryResult = Apollo.QueryResult<OrganizationQuery, OrganizationQueryVariables>;
export const OrganizationsDocument = gql`
    query Organizations($child: ID, $createPath: Any, $page: Int, $pageSize: Int, $dissolved: Boolean, $text: String) {
  organizations(
    child: $child
    page: $page
    pageSize: $pageSize
    dissolved: $dissolved
    text: $text
  ) @rest(type: "OrganizationsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...organizationFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${OrganizationFieldsFragmentDoc}`;

/**
 * __useOrganizationsQuery__
 *
 * To run a query within a React component, call `useOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationsQuery({
 *   variables: {
 *      child: // value for 'child'
 *      createPath: // value for 'createPath'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      dissolved: // value for 'dissolved'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, options);
      }
export function useOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, options);
        }
export function useOrganizationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, options);
        }
export type OrganizationsQueryHookResult = ReturnType<typeof useOrganizationsQuery>;
export type OrganizationsLazyQueryHookResult = ReturnType<typeof useOrganizationsLazyQuery>;
export type OrganizationsSuspenseQueryHookResult = ReturnType<typeof useOrganizationsSuspenseQuery>;
export type OrganizationsQueryResult = Apollo.QueryResult<OrganizationsQuery, OrganizationsQueryVariables>;
export const OrganizationClassDocument = gql`
    query OrganizationClass($id: ID!, $createPath: Any) {
  organizationClass(id: $id) @rest(type: "OrganizationClass", pathBuilder: $createPath) {
    ...organizationClassFields
  }
}
    ${OrganizationClassFieldsFragmentDoc}`;

/**
 * __useOrganizationClassQuery__
 *
 * To run a query within a React component, call `useOrganizationClassQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationClassQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationClassQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useOrganizationClassQuery(baseOptions: Apollo.QueryHookOptions<OrganizationClassQuery, OrganizationClassQueryVariables> & ({ variables: OrganizationClassQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationClassQuery, OrganizationClassQueryVariables>(OrganizationClassDocument, options);
      }
export function useOrganizationClassLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationClassQuery, OrganizationClassQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationClassQuery, OrganizationClassQueryVariables>(OrganizationClassDocument, options);
        }
export function useOrganizationClassSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationClassQuery, OrganizationClassQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationClassQuery, OrganizationClassQueryVariables>(OrganizationClassDocument, options);
        }
export type OrganizationClassQueryHookResult = ReturnType<typeof useOrganizationClassQuery>;
export type OrganizationClassLazyQueryHookResult = ReturnType<typeof useOrganizationClassLazyQuery>;
export type OrganizationClassSuspenseQueryHookResult = ReturnType<typeof useOrganizationClassSuspenseQuery>;
export type OrganizationClassQueryResult = Apollo.QueryResult<OrganizationClassQuery, OrganizationClassQueryVariables>;
export const OrganizationClassesDocument = gql`
    query OrganizationClasses($createPath: Any, $page: Int, $pageSize: Int) {
  organizationClasses(page: $page, pageSize: $pageSize) @rest(type: "OrganizationClassesResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...organizationClassFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${OrganizationClassFieldsFragmentDoc}`;

/**
 * __useOrganizationClassesQuery__
 *
 * To run a query within a React component, call `useOrganizationClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationClassesQuery({
 *   variables: {
 *      createPath: // value for 'createPath'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useOrganizationClassesQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationClassesQuery, OrganizationClassesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationClassesQuery, OrganizationClassesQueryVariables>(OrganizationClassesDocument, options);
      }
export function useOrganizationClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationClassesQuery, OrganizationClassesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationClassesQuery, OrganizationClassesQueryVariables>(OrganizationClassesDocument, options);
        }
export function useOrganizationClassesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationClassesQuery, OrganizationClassesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationClassesQuery, OrganizationClassesQueryVariables>(OrganizationClassesDocument, options);
        }
export type OrganizationClassesQueryHookResult = ReturnType<typeof useOrganizationClassesQuery>;
export type OrganizationClassesLazyQueryHookResult = ReturnType<typeof useOrganizationClassesLazyQuery>;
export type OrganizationClassesSuspenseQueryHookResult = ReturnType<typeof useOrganizationClassesSuspenseQuery>;
export type OrganizationClassesQueryResult = Apollo.QueryResult<OrganizationClassesQuery, OrganizationClassesQueryVariables>;
export const CreatePlaceDocument = gql`
    mutation CreatePlace($input: CreatePlaceMutationInput!) {
  createPlace(input: $input) @rest(type: "Place", path: "/place/", method: "POST", bodyKey: "input") {
    ...placeFields
  }
}
    ${PlaceFieldsFragmentDoc}`;
export type CreatePlaceMutationFn = Apollo.MutationFunction<CreatePlaceMutation, CreatePlaceMutationVariables>;

/**
 * __useCreatePlaceMutation__
 *
 * To run a mutation, you first call `useCreatePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlaceMutation, { data, loading, error }] = useCreatePlaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePlaceMutation(baseOptions?: Apollo.MutationHookOptions<CreatePlaceMutation, CreatePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePlaceMutation, CreatePlaceMutationVariables>(CreatePlaceDocument, options);
      }
export type CreatePlaceMutationHookResult = ReturnType<typeof useCreatePlaceMutation>;
export type CreatePlaceMutationResult = Apollo.MutationResult<CreatePlaceMutation>;
export type CreatePlaceMutationOptions = Apollo.BaseMutationOptions<CreatePlaceMutation, CreatePlaceMutationVariables>;
export const DeletePlaceDocument = gql`
    mutation DeletePlace($id: ID!) {
  deletePlace(id: $id) @rest(type: "NoContent", path: "/place/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeletePlaceMutationFn = Apollo.MutationFunction<DeletePlaceMutation, DeletePlaceMutationVariables>;

/**
 * __useDeletePlaceMutation__
 *
 * To run a mutation, you first call `useDeletePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePlaceMutation, { data, loading, error }] = useDeletePlaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePlaceMutation(baseOptions?: Apollo.MutationHookOptions<DeletePlaceMutation, DeletePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePlaceMutation, DeletePlaceMutationVariables>(DeletePlaceDocument, options);
      }
export type DeletePlaceMutationHookResult = ReturnType<typeof useDeletePlaceMutation>;
export type DeletePlaceMutationResult = Apollo.MutationResult<DeletePlaceMutation>;
export type DeletePlaceMutationOptions = Apollo.BaseMutationOptions<DeletePlaceMutation, DeletePlaceMutationVariables>;
export const UpdatePlaceDocument = gql`
    mutation UpdatePlace($id: ID!, $input: UpdatePlaceMutationInput!) {
  updatePlace(id: $id, input: $input) @rest(type: "Place", path: "/place/{args.id}/", method: "PUT", bodyKey: "input") {
    ...placeFields
  }
}
    ${PlaceFieldsFragmentDoc}`;
export type UpdatePlaceMutationFn = Apollo.MutationFunction<UpdatePlaceMutation, UpdatePlaceMutationVariables>;

/**
 * __useUpdatePlaceMutation__
 *
 * To run a mutation, you first call `useUpdatePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlaceMutation, { data, loading, error }] = useUpdatePlaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePlaceMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlaceMutation, UpdatePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlaceMutation, UpdatePlaceMutationVariables>(UpdatePlaceDocument, options);
      }
export type UpdatePlaceMutationHookResult = ReturnType<typeof useUpdatePlaceMutation>;
export type UpdatePlaceMutationResult = Apollo.MutationResult<UpdatePlaceMutation>;
export type UpdatePlaceMutationOptions = Apollo.BaseMutationOptions<UpdatePlaceMutation, UpdatePlaceMutationVariables>;
export const PlaceDocument = gql`
    query Place($id: ID!, $createPath: Any) {
  place(id: $id) @rest(type: "Place", pathBuilder: $createPath) {
    ...placeFields
  }
}
    ${PlaceFieldsFragmentDoc}`;

/**
 * __usePlaceQuery__
 *
 * To run a query within a React component, call `usePlaceQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function usePlaceQuery(baseOptions: Apollo.QueryHookOptions<PlaceQuery, PlaceQueryVariables> & ({ variables: PlaceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
      }
export function usePlaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
        }
export function usePlaceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
        }
export type PlaceQueryHookResult = ReturnType<typeof usePlaceQuery>;
export type PlaceLazyQueryHookResult = ReturnType<typeof usePlaceLazyQuery>;
export type PlaceSuspenseQueryHookResult = ReturnType<typeof usePlaceSuspenseQuery>;
export type PlaceQueryResult = Apollo.QueryResult<PlaceQuery, PlaceQueryVariables>;
export const PlacesDocument = gql`
    query Places($dataSource: String, $division: [String], $hasUpcomingEvents: Boolean, $page: Int, $pageSize: Int, $showAllPlaces: Boolean, $sort: String, $text: String, $createPath: Any) {
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
    ${MetaFieldsFragmentDoc}
${PlaceFieldsFragmentDoc}`;

/**
 * __usePlacesQuery__
 *
 * To run a query within a React component, call `usePlacesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlacesQuery({
 *   variables: {
 *      dataSource: // value for 'dataSource'
 *      division: // value for 'division'
 *      hasUpcomingEvents: // value for 'hasUpcomingEvents'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      showAllPlaces: // value for 'showAllPlaces'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function usePlacesQuery(baseOptions?: Apollo.QueryHookOptions<PlacesQuery, PlacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlacesQuery, PlacesQueryVariables>(PlacesDocument, options);
      }
export function usePlacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlacesQuery, PlacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlacesQuery, PlacesQueryVariables>(PlacesDocument, options);
        }
export function usePlacesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PlacesQuery, PlacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PlacesQuery, PlacesQueryVariables>(PlacesDocument, options);
        }
export type PlacesQueryHookResult = ReturnType<typeof usePlacesQuery>;
export type PlacesLazyQueryHookResult = ReturnType<typeof usePlacesLazyQuery>;
export type PlacesSuspenseQueryHookResult = ReturnType<typeof usePlacesSuspenseQuery>;
export type PlacesQueryResult = Apollo.QueryResult<PlacesQuery, PlacesQueryVariables>;
export const CreatePriceGroupDocument = gql`
    mutation CreatePriceGroup($input: CreatePriceGroupMutationInput!) {
  createPriceGroup(input: $input) @rest(type: "PriceGroup", path: "/price_group/", method: "POST", bodyKey: "input") {
    ...priceGroupFields
  }
}
    ${PriceGroupFieldsFragmentDoc}`;
export type CreatePriceGroupMutationFn = Apollo.MutationFunction<CreatePriceGroupMutation, CreatePriceGroupMutationVariables>;

/**
 * __useCreatePriceGroupMutation__
 *
 * To run a mutation, you first call `useCreatePriceGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePriceGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPriceGroupMutation, { data, loading, error }] = useCreatePriceGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePriceGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreatePriceGroupMutation, CreatePriceGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePriceGroupMutation, CreatePriceGroupMutationVariables>(CreatePriceGroupDocument, options);
      }
export type CreatePriceGroupMutationHookResult = ReturnType<typeof useCreatePriceGroupMutation>;
export type CreatePriceGroupMutationResult = Apollo.MutationResult<CreatePriceGroupMutation>;
export type CreatePriceGroupMutationOptions = Apollo.BaseMutationOptions<CreatePriceGroupMutation, CreatePriceGroupMutationVariables>;
export const DeletePriceGroupDocument = gql`
    mutation DeletePriceGroup($id: Int!) {
  deletePriceGroup(id: $id) @rest(type: "NoContent", path: "/price_group/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeletePriceGroupMutationFn = Apollo.MutationFunction<DeletePriceGroupMutation, DeletePriceGroupMutationVariables>;

/**
 * __useDeletePriceGroupMutation__
 *
 * To run a mutation, you first call `useDeletePriceGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePriceGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePriceGroupMutation, { data, loading, error }] = useDeletePriceGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePriceGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeletePriceGroupMutation, DeletePriceGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePriceGroupMutation, DeletePriceGroupMutationVariables>(DeletePriceGroupDocument, options);
      }
export type DeletePriceGroupMutationHookResult = ReturnType<typeof useDeletePriceGroupMutation>;
export type DeletePriceGroupMutationResult = Apollo.MutationResult<DeletePriceGroupMutation>;
export type DeletePriceGroupMutationOptions = Apollo.BaseMutationOptions<DeletePriceGroupMutation, DeletePriceGroupMutationVariables>;
export const UpdatePriceGroupDocument = gql`
    mutation UpdatePriceGroup($id: Int!, $input: UpdatePriceGroupMutationInput!) {
  updatePriceGroup(id: $id, input: $input) @rest(type: "PriceGroup", path: "/price_group/{args.id}/", method: "PUT", bodyKey: "input") {
    ...priceGroupFields
  }
}
    ${PriceGroupFieldsFragmentDoc}`;
export type UpdatePriceGroupMutationFn = Apollo.MutationFunction<UpdatePriceGroupMutation, UpdatePriceGroupMutationVariables>;

/**
 * __useUpdatePriceGroupMutation__
 *
 * To run a mutation, you first call `useUpdatePriceGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePriceGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePriceGroupMutation, { data, loading, error }] = useUpdatePriceGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePriceGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePriceGroupMutation, UpdatePriceGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePriceGroupMutation, UpdatePriceGroupMutationVariables>(UpdatePriceGroupDocument, options);
      }
export type UpdatePriceGroupMutationHookResult = ReturnType<typeof useUpdatePriceGroupMutation>;
export type UpdatePriceGroupMutationResult = Apollo.MutationResult<UpdatePriceGroupMutation>;
export type UpdatePriceGroupMutationOptions = Apollo.BaseMutationOptions<UpdatePriceGroupMutation, UpdatePriceGroupMutationVariables>;
export const PriceGroupDocument = gql`
    query PriceGroup($id: ID!) {
  priceGroup(id: $id) @rest(type: "PriceGroup", path: "/price_group/{args.id}/") {
    ...priceGroupFields
  }
}
    ${PriceGroupFieldsFragmentDoc}`;

/**
 * __usePriceGroupQuery__
 *
 * To run a query within a React component, call `usePriceGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `usePriceGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePriceGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePriceGroupQuery(baseOptions: Apollo.QueryHookOptions<PriceGroupQuery, PriceGroupQueryVariables> & ({ variables: PriceGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PriceGroupQuery, PriceGroupQueryVariables>(PriceGroupDocument, options);
      }
export function usePriceGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PriceGroupQuery, PriceGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PriceGroupQuery, PriceGroupQueryVariables>(PriceGroupDocument, options);
        }
export function usePriceGroupSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PriceGroupQuery, PriceGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PriceGroupQuery, PriceGroupQueryVariables>(PriceGroupDocument, options);
        }
export type PriceGroupQueryHookResult = ReturnType<typeof usePriceGroupQuery>;
export type PriceGroupLazyQueryHookResult = ReturnType<typeof usePriceGroupLazyQuery>;
export type PriceGroupSuspenseQueryHookResult = ReturnType<typeof usePriceGroupSuspenseQuery>;
export type PriceGroupQueryResult = Apollo.QueryResult<PriceGroupQuery, PriceGroupQueryVariables>;
export const PriceGroupsDocument = gql`
    query PriceGroups($description: String, $isFree: Boolean, $page: Int, $pageSize: Int, $publisher: [String], $sort: String, $createPath: Any) {
  priceGroups(
    description: $description
    isFree: $isFree
    page: $page
    pageSize: $pageSize
    publisher: $publisher
    sort: $sort
  ) @rest(type: "PriceGroupsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...priceGroupFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${PriceGroupFieldsFragmentDoc}`;

/**
 * __usePriceGroupsQuery__
 *
 * To run a query within a React component, call `usePriceGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePriceGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePriceGroupsQuery({
 *   variables: {
 *      description: // value for 'description'
 *      isFree: // value for 'isFree'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
 *      sort: // value for 'sort'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function usePriceGroupsQuery(baseOptions?: Apollo.QueryHookOptions<PriceGroupsQuery, PriceGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PriceGroupsQuery, PriceGroupsQueryVariables>(PriceGroupsDocument, options);
      }
export function usePriceGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PriceGroupsQuery, PriceGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PriceGroupsQuery, PriceGroupsQueryVariables>(PriceGroupsDocument, options);
        }
export function usePriceGroupsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PriceGroupsQuery, PriceGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PriceGroupsQuery, PriceGroupsQueryVariables>(PriceGroupsDocument, options);
        }
export type PriceGroupsQueryHookResult = ReturnType<typeof usePriceGroupsQuery>;
export type PriceGroupsLazyQueryHookResult = ReturnType<typeof usePriceGroupsLazyQuery>;
export type PriceGroupsSuspenseQueryHookResult = ReturnType<typeof usePriceGroupsSuspenseQuery>;
export type PriceGroupsQueryResult = Apollo.QueryResult<PriceGroupsQuery, PriceGroupsQueryVariables>;
export const CreateRegistrationDocument = gql`
    mutation CreateRegistration($input: CreateRegistrationMutationInput!) {
  createRegistration(input: $input) @rest(type: "Registration", path: "/registration/", method: "POST", bodyKey: "input") {
    ...registrationFields
  }
}
    ${RegistrationFieldsFragmentDoc}`;
export type CreateRegistrationMutationFn = Apollo.MutationFunction<CreateRegistrationMutation, CreateRegistrationMutationVariables>;

/**
 * __useCreateRegistrationMutation__
 *
 * To run a mutation, you first call `useCreateRegistrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRegistrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRegistrationMutation, { data, loading, error }] = useCreateRegistrationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRegistrationMutation(baseOptions?: Apollo.MutationHookOptions<CreateRegistrationMutation, CreateRegistrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRegistrationMutation, CreateRegistrationMutationVariables>(CreateRegistrationDocument, options);
      }
export type CreateRegistrationMutationHookResult = ReturnType<typeof useCreateRegistrationMutation>;
export type CreateRegistrationMutationResult = Apollo.MutationResult<CreateRegistrationMutation>;
export type CreateRegistrationMutationOptions = Apollo.BaseMutationOptions<CreateRegistrationMutation, CreateRegistrationMutationVariables>;
export const DeleteRegistrationDocument = gql`
    mutation DeleteRegistration($id: ID!) {
  deleteRegistration(id: $id) @rest(type: "NoContent", path: "/registration/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteRegistrationMutationFn = Apollo.MutationFunction<DeleteRegistrationMutation, DeleteRegistrationMutationVariables>;

/**
 * __useDeleteRegistrationMutation__
 *
 * To run a mutation, you first call `useDeleteRegistrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRegistrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRegistrationMutation, { data, loading, error }] = useDeleteRegistrationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRegistrationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRegistrationMutation, DeleteRegistrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRegistrationMutation, DeleteRegistrationMutationVariables>(DeleteRegistrationDocument, options);
      }
export type DeleteRegistrationMutationHookResult = ReturnType<typeof useDeleteRegistrationMutation>;
export type DeleteRegistrationMutationResult = Apollo.MutationResult<DeleteRegistrationMutation>;
export type DeleteRegistrationMutationOptions = Apollo.BaseMutationOptions<DeleteRegistrationMutation, DeleteRegistrationMutationVariables>;
export const UpdateRegistrationDocument = gql`
    mutation UpdateRegistration($id: ID!, $input: UpdateRegistrationMutationInput!) {
  updateRegistration(id: $id, input: $input) @rest(type: "Registration", path: "/registration/{args.id}/", method: "PUT", bodyKey: "input") {
    ...registrationFields
  }
}
    ${RegistrationFieldsFragmentDoc}`;
export type UpdateRegistrationMutationFn = Apollo.MutationFunction<UpdateRegistrationMutation, UpdateRegistrationMutationVariables>;

/**
 * __useUpdateRegistrationMutation__
 *
 * To run a mutation, you first call `useUpdateRegistrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRegistrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRegistrationMutation, { data, loading, error }] = useUpdateRegistrationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRegistrationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRegistrationMutation, UpdateRegistrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRegistrationMutation, UpdateRegistrationMutationVariables>(UpdateRegistrationDocument, options);
      }
export type UpdateRegistrationMutationHookResult = ReturnType<typeof useUpdateRegistrationMutation>;
export type UpdateRegistrationMutationResult = Apollo.MutationResult<UpdateRegistrationMutation>;
export type UpdateRegistrationMutationOptions = Apollo.BaseMutationOptions<UpdateRegistrationMutation, UpdateRegistrationMutationVariables>;
export const RegistrationDocument = gql`
    query Registration($id: ID!, $include: [String], $createPath: Any) {
  registration(id: $id, include: $include) @rest(type: "Registration", pathBuilder: $createPath) {
    ...registrationFields
  }
}
    ${RegistrationFieldsFragmentDoc}`;

/**
 * __useRegistrationQuery__
 *
 * To run a query within a React component, call `useRegistrationQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegistrationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegistrationQuery({
 *   variables: {
 *      id: // value for 'id'
 *      include: // value for 'include'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useRegistrationQuery(baseOptions: Apollo.QueryHookOptions<RegistrationQuery, RegistrationQueryVariables> & ({ variables: RegistrationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegistrationQuery, RegistrationQueryVariables>(RegistrationDocument, options);
      }
export function useRegistrationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegistrationQuery, RegistrationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegistrationQuery, RegistrationQueryVariables>(RegistrationDocument, options);
        }
export function useRegistrationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RegistrationQuery, RegistrationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RegistrationQuery, RegistrationQueryVariables>(RegistrationDocument, options);
        }
export type RegistrationQueryHookResult = ReturnType<typeof useRegistrationQuery>;
export type RegistrationLazyQueryHookResult = ReturnType<typeof useRegistrationLazyQuery>;
export type RegistrationSuspenseQueryHookResult = ReturnType<typeof useRegistrationSuspenseQuery>;
export type RegistrationQueryResult = Apollo.QueryResult<RegistrationQuery, RegistrationQueryVariables>;
export const SendRegistrationUserAccessInvitationDocument = gql`
    mutation SendRegistrationUserAccessInvitation($id: Int!) {
  sendRegistrationUserAccessInvitation(id: $id) @rest(type: "NoContent", path: "/registration_user_access/{args.id}/send_invitation/", method: "POST", bodyKey: "id") {
    noContent
  }
}
    `;
export type SendRegistrationUserAccessInvitationMutationFn = Apollo.MutationFunction<SendRegistrationUserAccessInvitationMutation, SendRegistrationUserAccessInvitationMutationVariables>;

/**
 * __useSendRegistrationUserAccessInvitationMutation__
 *
 * To run a mutation, you first call `useSendRegistrationUserAccessInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendRegistrationUserAccessInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendRegistrationUserAccessInvitationMutation, { data, loading, error }] = useSendRegistrationUserAccessInvitationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSendRegistrationUserAccessInvitationMutation(baseOptions?: Apollo.MutationHookOptions<SendRegistrationUserAccessInvitationMutation, SendRegistrationUserAccessInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendRegistrationUserAccessInvitationMutation, SendRegistrationUserAccessInvitationMutationVariables>(SendRegistrationUserAccessInvitationDocument, options);
      }
export type SendRegistrationUserAccessInvitationMutationHookResult = ReturnType<typeof useSendRegistrationUserAccessInvitationMutation>;
export type SendRegistrationUserAccessInvitationMutationResult = Apollo.MutationResult<SendRegistrationUserAccessInvitationMutation>;
export type SendRegistrationUserAccessInvitationMutationOptions = Apollo.BaseMutationOptions<SendRegistrationUserAccessInvitationMutation, SendRegistrationUserAccessInvitationMutationVariables>;
export const RegistrationsDocument = gql`
    query Registrations($adminUser: Boolean, $eventType: [EventTypeId], $include: [String], $page: Int, $pageSize: Int, $publisher: [String], $text: String, $createPath: Any) {
  registrations(
    adminUser: $adminUser
    eventType: $eventType
    include: $include
    page: $page
    pageSize: $pageSize
    publisher: $publisher
    text: $text
  ) @rest(type: "RegistrationsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...registrationFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${RegistrationFieldsFragmentDoc}`;

/**
 * __useRegistrationsQuery__
 *
 * To run a query within a React component, call `useRegistrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegistrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegistrationsQuery({
 *   variables: {
 *      adminUser: // value for 'adminUser'
 *      eventType: // value for 'eventType'
 *      include: // value for 'include'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useRegistrationsQuery(baseOptions?: Apollo.QueryHookOptions<RegistrationsQuery, RegistrationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegistrationsQuery, RegistrationsQueryVariables>(RegistrationsDocument, options);
      }
export function useRegistrationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegistrationsQuery, RegistrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegistrationsQuery, RegistrationsQueryVariables>(RegistrationsDocument, options);
        }
export function useRegistrationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RegistrationsQuery, RegistrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RegistrationsQuery, RegistrationsQueryVariables>(RegistrationsDocument, options);
        }
export type RegistrationsQueryHookResult = ReturnType<typeof useRegistrationsQuery>;
export type RegistrationsLazyQueryHookResult = ReturnType<typeof useRegistrationsLazyQuery>;
export type RegistrationsSuspenseQueryHookResult = ReturnType<typeof useRegistrationsSuspenseQuery>;
export type RegistrationsQueryResult = Apollo.QueryResult<RegistrationsQuery, RegistrationsQueryVariables>;
export const CreateSeatsReservationDocument = gql`
    mutation CreateSeatsReservation($input: CreateSeatsReservationMutationInput!) {
  createSeatsReservation(input: $input) @rest(type: "SeatsReservation", path: "/seats_reservation/", method: "POST", bodyKey: "input") {
    ...seatsReservationFields
  }
}
    ${SeatsReservationFieldsFragmentDoc}`;
export type CreateSeatsReservationMutationFn = Apollo.MutationFunction<CreateSeatsReservationMutation, CreateSeatsReservationMutationVariables>;

/**
 * __useCreateSeatsReservationMutation__
 *
 * To run a mutation, you first call `useCreateSeatsReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeatsReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeatsReservationMutation, { data, loading, error }] = useCreateSeatsReservationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSeatsReservationMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeatsReservationMutation, CreateSeatsReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeatsReservationMutation, CreateSeatsReservationMutationVariables>(CreateSeatsReservationDocument, options);
      }
export type CreateSeatsReservationMutationHookResult = ReturnType<typeof useCreateSeatsReservationMutation>;
export type CreateSeatsReservationMutationResult = Apollo.MutationResult<CreateSeatsReservationMutation>;
export type CreateSeatsReservationMutationOptions = Apollo.BaseMutationOptions<CreateSeatsReservationMutation, CreateSeatsReservationMutationVariables>;
export const UpdateSeatsReservationDocument = gql`
    mutation UpdateSeatsReservation($id: ID!, $input: UpdateSeatsReservationMutationInput!) {
  updateSeatsReservation(id: $id, input: $input) @rest(type: "SeatsReservation", path: "/seats_reservation/{args.id}/", method: "PUT", bodyKey: "input") {
    ...seatsReservationFields
  }
}
    ${SeatsReservationFieldsFragmentDoc}`;
export type UpdateSeatsReservationMutationFn = Apollo.MutationFunction<UpdateSeatsReservationMutation, UpdateSeatsReservationMutationVariables>;

/**
 * __useUpdateSeatsReservationMutation__
 *
 * To run a mutation, you first call `useUpdateSeatsReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSeatsReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSeatsReservationMutation, { data, loading, error }] = useUpdateSeatsReservationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSeatsReservationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSeatsReservationMutation, UpdateSeatsReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSeatsReservationMutation, UpdateSeatsReservationMutationVariables>(UpdateSeatsReservationDocument, options);
      }
export type UpdateSeatsReservationMutationHookResult = ReturnType<typeof useUpdateSeatsReservationMutation>;
export type UpdateSeatsReservationMutationResult = Apollo.MutationResult<UpdateSeatsReservationMutation>;
export type UpdateSeatsReservationMutationOptions = Apollo.BaseMutationOptions<UpdateSeatsReservationMutation, UpdateSeatsReservationMutationVariables>;
export const CreateSignupsDocument = gql`
    mutation CreateSignups($input: CreateSignupsMutationInput!) {
  createSignups(input: $input) @rest(type: "[Signup!]!", path: "/signup/", method: "POST", bodyKey: "input") {
    ...signupFields
  }
}
    ${SignupFieldsFragmentDoc}`;
export type CreateSignupsMutationFn = Apollo.MutationFunction<CreateSignupsMutation, CreateSignupsMutationVariables>;

/**
 * __useCreateSignupsMutation__
 *
 * To run a mutation, you first call `useCreateSignupsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignupsMutation, { data, loading, error }] = useCreateSignupsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSignupsMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupsMutation, CreateSignupsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignupsMutation, CreateSignupsMutationVariables>(CreateSignupsDocument, options);
      }
export type CreateSignupsMutationHookResult = ReturnType<typeof useCreateSignupsMutation>;
export type CreateSignupsMutationResult = Apollo.MutationResult<CreateSignupsMutation>;
export type CreateSignupsMutationOptions = Apollo.BaseMutationOptions<CreateSignupsMutation, CreateSignupsMutationVariables>;
export const DeleteSignupDocument = gql`
    mutation DeleteSignup($id: ID!) {
  deleteSignup(id: $id) @rest(type: "NoContent", path: "/signup/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteSignupMutationFn = Apollo.MutationFunction<DeleteSignupMutation, DeleteSignupMutationVariables>;

/**
 * __useDeleteSignupMutation__
 *
 * To run a mutation, you first call `useDeleteSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSignupMutation, { data, loading, error }] = useDeleteSignupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSignupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSignupMutation, DeleteSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSignupMutation, DeleteSignupMutationVariables>(DeleteSignupDocument, options);
      }
export type DeleteSignupMutationHookResult = ReturnType<typeof useDeleteSignupMutation>;
export type DeleteSignupMutationResult = Apollo.MutationResult<DeleteSignupMutation>;
export type DeleteSignupMutationOptions = Apollo.BaseMutationOptions<DeleteSignupMutation, DeleteSignupMutationVariables>;
export const UpdateSignupDocument = gql`
    mutation UpdateSignup($input: UpdateSignupMutationInput!, $id: ID!) {
  updateSignup(input: $input, id: $id) @rest(type: "Signup", path: "/signup/{args.id}/", method: "PUT", bodyKey: "input") {
    ...signupFields
  }
}
    ${SignupFieldsFragmentDoc}`;
export type UpdateSignupMutationFn = Apollo.MutationFunction<UpdateSignupMutation, UpdateSignupMutationVariables>;

/**
 * __useUpdateSignupMutation__
 *
 * To run a mutation, you first call `useUpdateSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupMutation, { data, loading, error }] = useUpdateSignupMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateSignupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupMutation, UpdateSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignupMutation, UpdateSignupMutationVariables>(UpdateSignupDocument, options);
      }
export type UpdateSignupMutationHookResult = ReturnType<typeof useUpdateSignupMutation>;
export type UpdateSignupMutationResult = Apollo.MutationResult<UpdateSignupMutation>;
export type UpdateSignupMutationOptions = Apollo.BaseMutationOptions<UpdateSignupMutation, UpdateSignupMutationVariables>;
export const PatchSignupDocument = gql`
    mutation PatchSignup($input: UpdateSignupMutationInput!, $id: ID!) {
  updateSignup(input: $input, id: $id) @rest(type: "Signup", path: "/signup/{args.id}/", method: "PATCH", bodyKey: "input") {
    ...signupFields
  }
}
    ${SignupFieldsFragmentDoc}`;
export type PatchSignupMutationFn = Apollo.MutationFunction<PatchSignupMutation, PatchSignupMutationVariables>;

/**
 * __usePatchSignupMutation__
 *
 * To run a mutation, you first call `usePatchSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchSignupMutation, { data, loading, error }] = usePatchSignupMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePatchSignupMutation(baseOptions?: Apollo.MutationHookOptions<PatchSignupMutation, PatchSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PatchSignupMutation, PatchSignupMutationVariables>(PatchSignupDocument, options);
      }
export type PatchSignupMutationHookResult = ReturnType<typeof usePatchSignupMutation>;
export type PatchSignupMutationResult = Apollo.MutationResult<PatchSignupMutation>;
export type PatchSignupMutationOptions = Apollo.BaseMutationOptions<PatchSignupMutation, PatchSignupMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($input: SendMessageMutationInput!, $registration: ID!) {
  sendMessage(input: $input, registration: $registration) @rest(type: "SendMessageResponse", path: "/registration/{args.registration}/send_message/", method: "POST", bodyKey: "input") {
    htmlMessage
    message
    signups
    subject
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *      registration: // value for 'registration'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const SignupDocument = gql`
    query Signup($id: ID!) {
  signup(id: $id) @rest(type: "Signup", path: "/signup/{args.id}/", method: "GET") {
    ...signupFields
  }
}
    ${SignupFieldsFragmentDoc}`;

/**
 * __useSignupQuery__
 *
 * To run a query within a React component, call `useSignupQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSignupQuery(baseOptions: Apollo.QueryHookOptions<SignupQuery, SignupQueryVariables> & ({ variables: SignupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupQuery, SignupQueryVariables>(SignupDocument, options);
      }
export function useSignupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupQuery, SignupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupQuery, SignupQueryVariables>(SignupDocument, options);
        }
export function useSignupSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupQuery, SignupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupQuery, SignupQueryVariables>(SignupDocument, options);
        }
export type SignupQueryHookResult = ReturnType<typeof useSignupQuery>;
export type SignupLazyQueryHookResult = ReturnType<typeof useSignupLazyQuery>;
export type SignupSuspenseQueryHookResult = ReturnType<typeof useSignupSuspenseQuery>;
export type SignupQueryResult = Apollo.QueryResult<SignupQuery, SignupQueryVariables>;
export const CreateSignupGroupDocument = gql`
    mutation CreateSignupGroup($input: CreateSignupGroupMutationInput!) {
  createSignupGroup(input: $input) @rest(type: "CreateSignupGroupResponse", path: "/signup_group/", method: "POST", bodyKey: "input") {
    ...createSignupGroupFields
  }
}
    ${CreateSignupGroupFieldsFragmentDoc}`;
export type CreateSignupGroupMutationFn = Apollo.MutationFunction<CreateSignupGroupMutation, CreateSignupGroupMutationVariables>;

/**
 * __useCreateSignupGroupMutation__
 *
 * To run a mutation, you first call `useCreateSignupGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignupGroupMutation, { data, loading, error }] = useCreateSignupGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSignupGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupGroupMutation, CreateSignupGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignupGroupMutation, CreateSignupGroupMutationVariables>(CreateSignupGroupDocument, options);
      }
export type CreateSignupGroupMutationHookResult = ReturnType<typeof useCreateSignupGroupMutation>;
export type CreateSignupGroupMutationResult = Apollo.MutationResult<CreateSignupGroupMutation>;
export type CreateSignupGroupMutationOptions = Apollo.BaseMutationOptions<CreateSignupGroupMutation, CreateSignupGroupMutationVariables>;
export const DeleteSignupGroupDocument = gql`
    mutation DeleteSignupGroup($id: ID!) {
  deleteSignupGroup(id: $id) @rest(type: "NoContent", path: "/signup_group/{args.id}/", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteSignupGroupMutationFn = Apollo.MutationFunction<DeleteSignupGroupMutation, DeleteSignupGroupMutationVariables>;

/**
 * __useDeleteSignupGroupMutation__
 *
 * To run a mutation, you first call `useDeleteSignupGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSignupGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSignupGroupMutation, { data, loading, error }] = useDeleteSignupGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSignupGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSignupGroupMutation, DeleteSignupGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSignupGroupMutation, DeleteSignupGroupMutationVariables>(DeleteSignupGroupDocument, options);
      }
export type DeleteSignupGroupMutationHookResult = ReturnType<typeof useDeleteSignupGroupMutation>;
export type DeleteSignupGroupMutationResult = Apollo.MutationResult<DeleteSignupGroupMutation>;
export type DeleteSignupGroupMutationOptions = Apollo.BaseMutationOptions<DeleteSignupGroupMutation, DeleteSignupGroupMutationVariables>;
export const UpdateSignupGroupDocument = gql`
    mutation UpdateSignupGroup($input: UpdateSignupGroupMutationInput!, $id: ID!) {
  updateSignupGroup(input: $input, id: $id) @rest(type: "SignupGroup", path: "/signup_group/{args.id}/", method: "PUT", bodyKey: "input") {
    ...signupGroupFields
  }
}
    ${SignupGroupFieldsFragmentDoc}`;
export type UpdateSignupGroupMutationFn = Apollo.MutationFunction<UpdateSignupGroupMutation, UpdateSignupGroupMutationVariables>;

/**
 * __useUpdateSignupGroupMutation__
 *
 * To run a mutation, you first call `useUpdateSignupGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupGroupMutation, { data, loading, error }] = useUpdateSignupGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateSignupGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupGroupMutation, UpdateSignupGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignupGroupMutation, UpdateSignupGroupMutationVariables>(UpdateSignupGroupDocument, options);
      }
export type UpdateSignupGroupMutationHookResult = ReturnType<typeof useUpdateSignupGroupMutation>;
export type UpdateSignupGroupMutationResult = Apollo.MutationResult<UpdateSignupGroupMutation>;
export type UpdateSignupGroupMutationOptions = Apollo.BaseMutationOptions<UpdateSignupGroupMutation, UpdateSignupGroupMutationVariables>;
export const SignupGroupDocument = gql`
    query SignupGroup($id: ID!) {
  signupGroup(id: $id) @rest(type: "SignupGroup", path: "/signup_group/{args.id}/", method: "GET") {
    ...signupGroupFields
  }
}
    ${SignupGroupFieldsFragmentDoc}`;

/**
 * __useSignupGroupQuery__
 *
 * To run a query within a React component, call `useSignupGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSignupGroupQuery(baseOptions: Apollo.QueryHookOptions<SignupGroupQuery, SignupGroupQueryVariables> & ({ variables: SignupGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupGroupQuery, SignupGroupQueryVariables>(SignupGroupDocument, options);
      }
export function useSignupGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupGroupQuery, SignupGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupGroupQuery, SignupGroupQueryVariables>(SignupGroupDocument, options);
        }
export function useSignupGroupSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupGroupQuery, SignupGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupGroupQuery, SignupGroupQueryVariables>(SignupGroupDocument, options);
        }
export type SignupGroupQueryHookResult = ReturnType<typeof useSignupGroupQuery>;
export type SignupGroupLazyQueryHookResult = ReturnType<typeof useSignupGroupLazyQuery>;
export type SignupGroupSuspenseQueryHookResult = ReturnType<typeof useSignupGroupSuspenseQuery>;
export type SignupGroupQueryResult = Apollo.QueryResult<SignupGroupQuery, SignupGroupQueryVariables>;
export const SignupsDocument = gql`
    query Signups($attendeeStatus: AttendeeStatus, $page: Int, $pageSize: Int, $registration: [ID], $text: String, $createPath: Any) {
  signups(
    attendeeStatus: $attendeeStatus
    page: $page
    pageSize: $pageSize
    registration: $registration
    text: $text
  ) @rest(type: "SignupsResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...signupFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${SignupFieldsFragmentDoc}`;

/**
 * __useSignupsQuery__
 *
 * To run a query within a React component, call `useSignupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupsQuery({
 *   variables: {
 *      attendeeStatus: // value for 'attendeeStatus'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      registration: // value for 'registration'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useSignupsQuery(baseOptions?: Apollo.QueryHookOptions<SignupsQuery, SignupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupsQuery, SignupsQueryVariables>(SignupsDocument, options);
      }
export function useSignupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupsQuery, SignupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupsQuery, SignupsQueryVariables>(SignupsDocument, options);
        }
export function useSignupsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupsQuery, SignupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupsQuery, SignupsQueryVariables>(SignupsDocument, options);
        }
export type SignupsQueryHookResult = ReturnType<typeof useSignupsQuery>;
export type SignupsLazyQueryHookResult = ReturnType<typeof useSignupsLazyQuery>;
export type SignupsSuspenseQueryHookResult = ReturnType<typeof useSignupsSuspenseQuery>;
export type SignupsQueryResult = Apollo.QueryResult<SignupsQuery, SignupsQueryVariables>;
export const UserDocument = gql`
    query User($id: ID!, $createPath: Any) {
  user(id: $id) @rest(type: "User", pathBuilder: $createPath) {
    ...userFields
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($createPath: Any, $page: Int, $pageSize: Int) {
  users(page: $page, pageSize: $pageSize) @rest(type: "UsersResponse", pathBuilder: $createPath) {
    meta {
      ...metaFields
    }
    data {
      ...userFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${UserFieldsFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      createPath: // value for 'createPath'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;