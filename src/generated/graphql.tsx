import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
};

export enum AttendeeStatus {
  Attending = 'attending',
  Waitlisted = 'waitlisted'
}

export type CreateEnrolmentMutationInput = {
  city?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  extraInfo?: InputMaybe<Scalars['String']>;
  membershipNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nativeLanguage?: InputMaybe<Scalars['String']>;
  notifications?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  registration?: InputMaybe<Scalars['ID']>;
  serviceLanguage?: InputMaybe<Scalars['String']>;
  streetAddress?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};

export type CreateEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['Int']>;
  audienceMinAge?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<LocalisedObjectInput>;
  endTime?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  eventStatus?: InputMaybe<EventStatus>;
  externalLinks?: InputMaybe<Array<InputMaybe<ExternalLinkInput>>>;
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  location?: InputMaybe<IdObjectInput>;
  locationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<LocalisedObjectInput>;
  offers?: InputMaybe<Array<OfferInput>>;
  provider?: InputMaybe<LocalisedObjectInput>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Scalars['String']>;
  shortDescription?: InputMaybe<LocalisedObjectInput>;
  startTime?: InputMaybe<Scalars['String']>;
  subEvents?: InputMaybe<Array<IdObjectInput>>;
  superEvent?: InputMaybe<IdObjectInput>;
  superEventType?: InputMaybe<SuperEventType>;
  typeId?: InputMaybe<EventTypeId>;
  videos?: InputMaybe<Array<InputMaybe<VideoInput>>>;
};

export type CreateRegistrationMutationInput = {
  audienceMaxAge?: InputMaybe<Scalars['Int']>;
  audienceMinAge?: InputMaybe<Scalars['Int']>;
  confirmationMessage?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  event: Scalars['ID'];
  instructions?: InputMaybe<Scalars['String']>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  waitingListCapacity?: InputMaybe<Scalars['Int']>;
};

export type Division = {
  __typename?: 'Division';
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  ocdId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Enrolment = {
  __typename?: 'Enrolment';
  id: Scalars['ID'];
  attendeeStatus?: Maybe<AttendeeStatus>;
  cancellationCode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  extraInfo?: Maybe<Scalars['String']>;
  membershipNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nativeLanguage?: Maybe<Scalars['String']>;
  notifications?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  registration?: Maybe<Scalars['ID']>;
  serviceLanguage?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  id: Scalars['ID'];
  audience: Array<Maybe<Keyword>>;
  audienceMaxAge?: Maybe<Scalars['Int']>;
  audienceMinAge?: Maybe<Scalars['Int']>;
  createdBy?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  datePublished?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['String']>;
  description?: Maybe<LocalisedObject>;
  endTime?: Maybe<Scalars['String']>;
  enrolmentEndTime?: Maybe<Scalars['String']>;
  enrolmentStartTime?: Maybe<Scalars['String']>;
  extensionCourse?: Maybe<ExtensionCourse>;
  externalLinks: Array<Maybe<ExternalLink>>;
  eventStatus?: Maybe<EventStatus>;
  images: Array<Maybe<Image>>;
  infoUrl?: Maybe<LocalisedObject>;
  inLanguage: Array<Maybe<Language>>;
  keywords: Array<Maybe<Keyword>>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  location?: Maybe<Place>;
  locationExtraInfo?: Maybe<LocalisedObject>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalisedObject>;
  offers: Array<Maybe<Offer>>;
  provider?: Maybe<LocalisedObject>;
  providerContactInfo?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['ID']>;
  publicationStatus?: Maybe<PublicationStatus>;
  shortDescription?: Maybe<LocalisedObject>;
  startTime?: Maybe<Scalars['String']>;
  subEvents: Array<Maybe<Event>>;
  superEvent?: Maybe<Event>;
  superEventType?: Maybe<SuperEventType>;
  typeId?: Maybe<EventTypeId>;
  videos: Array<Maybe<Video>>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export enum EventStatus {
  EventCancelled = 'EventCancelled',
  EventPostponed = 'EventPostponed',
  EventRescheduled = 'EventRescheduled',
  EventScheduled = 'EventScheduled'
}

export enum EventTypeId {
  General = 'General',
  Course = 'Course',
  Volunteering = 'Volunteering'
}

export type EventsResponse = {
  __typename?: 'EventsResponse';
  meta: Meta;
  data: Array<Maybe<Event>>;
};

export type ExtensionCourse = {
  __typename?: 'ExtensionCourse';
  enrolmentStartTime?: Maybe<Scalars['String']>;
  enrolmentEndTime?: Maybe<Scalars['String']>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']>;
  remainingAttendeeCapacity?: Maybe<Scalars['Int']>;
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  name?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type ExternalLinkInput = {
  name?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
};

export type FeedbackInput = {
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
};

export type IdObjectInput = {
  atId: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  id?: Maybe<Scalars['ID']>;
  altText?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  cropping?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  license?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  photographerName?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type ImagesResponse = {
  __typename?: 'ImagesResponse';
  meta: Meta;
  data: Array<Maybe<Image>>;
};

export type Keyword = {
  __typename?: 'Keyword';
  id?: Maybe<Scalars['ID']>;
  aggregate?: Maybe<Scalars['Boolean']>;
  altLabels?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deprecated?: Maybe<Scalars['Boolean']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Image>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  nEvents?: Maybe<Scalars['Int']>;
  publisher?: Maybe<Scalars['ID']>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type KeywordSet = {
  __typename?: 'KeywordSet';
  id?: Maybe<Scalars['ID']>;
  keywords?: Maybe<Array<Maybe<Keyword>>>;
  usage?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  image?: Maybe<Image>;
  dataSource?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type KeywordSetsResponse = {
  __typename?: 'KeywordSetsResponse';
  meta: Meta;
  data: Array<Maybe<KeywordSet>>;
};

export type KeywordsResponse = {
  __typename?: 'KeywordsResponse';
  meta: Meta;
  data: Array<Maybe<Keyword>>;
};

export type Language = {
  __typename?: 'Language';
  id?: Maybe<Scalars['ID']>;
  translationAvailable?: Maybe<Scalars['Boolean']>;
  name?: Maybe<LocalisedObject>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type LanguagesResponse = {
  __typename?: 'LanguagesResponse';
  meta: Meta;
  data: Array<Maybe<Language>>;
};

export type LocalisedObject = {
  __typename?: 'LocalisedObject';
  ar?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  fi?: Maybe<Scalars['String']>;
  ru?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  zhHans?: Maybe<Scalars['String']>;
};

export type LocalisedObjectInput = {
  ar?: InputMaybe<Scalars['String']>;
  en?: InputMaybe<Scalars['String']>;
  fi?: InputMaybe<Scalars['String']>;
  ru?: InputMaybe<Scalars['String']>;
  sv?: InputMaybe<Scalars['String']>;
  zhHans?: InputMaybe<Scalars['String']>;
};

export type Meta = {
  __typename?: 'Meta';
  count: Scalars['Int'];
  next?: Maybe<Scalars['String']>;
  previous?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEnrolment: Enrolment;
  createEvent: Event;
  createEvents: Array<Event>;
  createRegistration: Registration;
  deleteEnrolment?: Maybe<NoContent>;
  deleteEvent?: Maybe<NoContent>;
  deleteRegistration?: Maybe<NoContent>;
  postFeedback?: Maybe<Feedback>;
  postGuestFeedback?: Maybe<Feedback>;
  updateEnrolment: Enrolment;
  updateEvent: Event;
  updateEvents: Array<Event>;
  updateImage: Image;
  uploadImage: Image;
  updateRegistration: Registration;
};


export type MutationCreateEnrolmentArgs = {
  input: CreateEnrolmentMutationInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventMutationInput;
};


export type MutationCreateEventsArgs = {
  input: Array<CreateEventMutationInput>;
};


export type MutationCreateRegistrationArgs = {
  input: CreateRegistrationMutationInput;
};


export type MutationDeleteEnrolmentArgs = {
  cancellationCode: Scalars['String'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRegistrationArgs = {
  id: Scalars['ID'];
};


export type MutationPostFeedbackArgs = {
  input: FeedbackInput;
};


export type MutationPostGuestFeedbackArgs = {
  input: FeedbackInput;
};


export type MutationUpdateEnrolmentArgs = {
  input: UpdateEnrolmentMutationInput;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventMutationInput;
};


export type MutationUpdateEventsArgs = {
  input: Array<UpdateEventMutationInput>;
};


export type MutationUpdateImageArgs = {
  input: UpdateImageMutationInput;
};


export type MutationUploadImageArgs = {
  input: UploadImageMutationInput;
};


export type MutationUpdateRegistrationArgs = {
  input: UpdateRegistrationMutationInput;
};

export type NoContent = {
  __typename?: 'NoContent';
  noContent?: Maybe<Scalars['Boolean']>;
};

export type Offer = {
  __typename?: 'Offer';
  description?: Maybe<LocalisedObject>;
  infoUrl?: Maybe<LocalisedObject>;
  isFree?: Maybe<Scalars['Boolean']>;
  price?: Maybe<LocalisedObject>;
};

export type OfferInput = {
  description?: InputMaybe<LocalisedObjectInput>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  price?: InputMaybe<LocalisedObjectInput>;
};

export type Organization = {
  __typename?: 'Organization';
  affiliatedOrganizations?: Maybe<Array<Maybe<Scalars['String']>>>;
  classification?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  dissolutionDate?: Maybe<Scalars['String']>;
  foundingDate?: Maybe<Scalars['String']>;
  hasRegularUsers?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  isAffiliated?: Maybe<Scalars['Boolean']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentOrganization?: Maybe<Scalars['String']>;
  replacedBy?: Maybe<Scalars['String']>;
  subOrganizations?: Maybe<Array<Maybe<Scalars['String']>>>;
  atContext?: Maybe<Scalars['String']>;
  atId: Scalars['String'];
  atType?: Maybe<Scalars['String']>;
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  meta: Meta;
  data: Array<Maybe<Organization>>;
};

export type Place = {
  __typename?: 'Place';
  id?: Maybe<Scalars['ID']>;
  addressCountry?: Maybe<Scalars['String']>;
  addressLocality?: Maybe<LocalisedObject>;
  addressRegion?: Maybe<Scalars['String']>;
  contactType?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  divisions: Array<Maybe<Division>>;
  email?: Maybe<Scalars['String']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Image>;
  infoUrl?: Maybe<LocalisedObject>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  nEvents?: Maybe<Scalars['Int']>;
  parent?: Maybe<Scalars['ID']>;
  position?: Maybe<Position>;
  postalCode?: Maybe<Scalars['String']>;
  postOfficeBoxNum?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['ID']>;
  replacedBy?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<LocalisedObject>;
  telephone?: Maybe<LocalisedObject>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type PlacesResponse = {
  __typename?: 'PlacesResponse';
  meta: Meta;
  data: Array<Maybe<Place>>;
};

export type Position = {
  __typename?: 'Position';
  coordinates: Array<Maybe<Scalars['Float']>>;
  type?: Maybe<Scalars['String']>;
};

export enum PublicationStatus {
  Draft = 'draft',
  Public = 'public'
}

export type Query = {
  __typename?: 'Query';
  enrolment: Enrolment;
  enrolments: Array<Maybe<Enrolment>>;
  event: Event;
  events: EventsResponse;
  keyword: Keyword;
  keywords: KeywordsResponse;
  keywordSet?: Maybe<KeywordSet>;
  keywordSets: KeywordSetsResponse;
  languages: LanguagesResponse;
  image: Image;
  images: ImagesResponse;
  organization: Organization;
  organizations: OrganizationsResponse;
  place: Place;
  places: PlacesResponse;
  registration: Registration;
  registrations: RegistrationsResponse;
  user: User;
};


export type QueryEnrolmentArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryEnrolmentsArgs = {
  attendeeStatus?: InputMaybe<AttendeeStatus>;
  events?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  registrations?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryEventArgs = {
  id?: InputMaybe<Scalars['ID']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryEventsArgs = {
  adminUser?: InputMaybe<Scalars['Boolean']>;
  createdBy?: InputMaybe<Scalars['String']>;
  combinedText?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  end?: InputMaybe<Scalars['String']>;
  endsAfter?: InputMaybe<Scalars['String']>;
  endsBefore?: InputMaybe<Scalars['String']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>>>;
  inLanguage?: InputMaybe<Scalars['String']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywordAnd?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  showAll?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
  startsAfter?: InputMaybe<Scalars['String']>;
  startsBefore?: InputMaybe<Scalars['String']>;
  superEvent?: InputMaybe<Scalars['ID']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  text?: InputMaybe<Scalars['String']>;
  translation?: InputMaybe<Scalars['String']>;
};


export type QueryKeywordArgs = {
  id: Scalars['ID'];
};


export type QueryKeywordsArgs = {
  dataSource?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  freeText?: InputMaybe<Scalars['String']>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryKeywordSetArgs = {
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryKeywordSetsArgs = {
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryImageArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryImagesArgs = {
  dataSource?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publisher?: InputMaybe<Scalars['ID']>;
};


export type QueryOrganizationArgs = {
  id: Scalars['ID'];
};


export type QueryOrganizationsArgs = {
  child?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryPlaceArgs = {
  id: Scalars['ID'];
};


export type QueryPlacesArgs = {
  dataSource?: InputMaybe<Scalars['String']>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryRegistrationArgs = {
  id?: InputMaybe<Scalars['ID']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryRegistrationsArgs = {
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Registration = {
  __typename?: 'Registration';
  id?: Maybe<Scalars['ID']>;
  attendeeRegistration?: Maybe<Scalars['Boolean']>;
  audienceMaxAge?: Maybe<Scalars['Int']>;
  audienceMinAge?: Maybe<Scalars['Int']>;
  confirmationMessage?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  currentAttendeeCount?: Maybe<Scalars['Int']>;
  currentWaitingListCount?: Maybe<Scalars['Int']>;
  enrolmentEndTime?: Maybe<Scalars['String']>;
  enrolmentStartTime?: Maybe<Scalars['String']>;
  event?: Maybe<Scalars['ID']>;
  instructions?: Maybe<Scalars['String']>;
  lastModifiedAt?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']>;
  signups?: Maybe<Array<Maybe<Enrolment>>>;
  waitingListCapacity?: Maybe<Scalars['Int']>;
  atId: Scalars['String'];
  atContext?: Maybe<Scalars['String']>;
  atType?: Maybe<Scalars['String']>;
};

export type RegistrationsResponse = {
  __typename?: 'RegistrationsResponse';
  meta: Meta;
  data: Array<Maybe<Registration>>;
};

export enum SuperEventType {
  Recurring = 'recurring',
  Umbrella = 'umbrella'
}

export type UpdateEnrolmentMutationInput = {
  id: Scalars['ID'];
  city?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  extraInfo?: InputMaybe<Scalars['String']>;
  membershipNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nativeLanguage?: InputMaybe<Scalars['String']>;
  notifications?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  registration?: InputMaybe<Scalars['ID']>;
  serviceLanguage?: InputMaybe<Scalars['String']>;
  streetAddress?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};

export type UpdateEventMutationInput = {
  id: Scalars['ID'];
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['Int']>;
  audienceMinAge?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<LocalisedObjectInput>;
  endTime?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  eventStatus?: InputMaybe<EventStatus>;
  externalLinks?: InputMaybe<Array<InputMaybe<ExternalLinkInput>>>;
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords?: InputMaybe<Array<IdObjectInput>>;
  location?: InputMaybe<IdObjectInput>;
  locationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<LocalisedObjectInput>;
  offers?: InputMaybe<Array<OfferInput>>;
  provider?: InputMaybe<LocalisedObjectInput>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  shortDescription?: InputMaybe<LocalisedObjectInput>;
  startTime?: InputMaybe<Scalars['String']>;
  subEvents?: InputMaybe<Array<IdObjectInput>>;
  superEvent?: InputMaybe<IdObjectInput>;
  superEventType?: InputMaybe<SuperEventType>;
  typeId?: InputMaybe<EventTypeId>;
  videos?: InputMaybe<Array<InputMaybe<VideoInput>>>;
};

export type UpdateImageMutationInput = {
  altText?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  license?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  photographerName?: InputMaybe<Scalars['String']>;
};

export type UpdateRegistrationMutationInput = {
  id: Scalars['ID'];
  audienceMaxAge?: InputMaybe<Scalars['Int']>;
  audienceMinAge?: InputMaybe<Scalars['Int']>;
  confirmationMessage?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  event: Scalars['ID'];
  instructions?: InputMaybe<Scalars['String']>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  waitingListCapacity?: InputMaybe<Scalars['Int']>;
};

export type UploadImageMutationInput = {
  altText?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['Any']>;
  license?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  photographerName?: InputMaybe<Scalars['String']>;
  publisher?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  adminOrganizations: Array<Scalars['String']>;
  dateJoined?: Maybe<Scalars['String']>;
  departmentName?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  isStaff?: Maybe<Scalars['Boolean']>;
  lastLogin?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  organizationMemberships: Array<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  uuid?: Maybe<Scalars['String']>;
};

export type Video = {
  __typename?: 'Video';
  altText?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type VideoInput = {
  altText?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type CreateEnrolmentMutationVariables = Exact<{
  input: CreateEnrolmentMutationInput;
}>;


export type CreateEnrolmentMutation = { __typename?: 'Mutation', createEnrolment: { __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } };

export type DeleteEnrolmentMutationVariables = Exact<{
  cancellationCode: Scalars['String'];
}>;


export type DeleteEnrolmentMutation = { __typename?: 'Mutation', deleteEnrolment?: { __typename?: 'NoContent', noContent?: boolean | null | undefined } | null | undefined };

export type UpdateEnrolmentMutationVariables = Exact<{
  input: UpdateEnrolmentMutationInput;
}>;


export type UpdateEnrolmentMutation = { __typename?: 'Mutation', updateEnrolment: { __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } };

export type EnrolmentFieldsFragment = { __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined };

export type EnrolmentQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type EnrolmentQuery = { __typename?: 'Query', enrolment: { __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } };

export type EnrolmentsQueryVariables = Exact<{
  attendeeStatus?: InputMaybe<AttendeeStatus>;
  events?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  registrations?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  text?: InputMaybe<Scalars['String']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type EnrolmentsQuery = { __typename?: 'Query', enrolments: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventMutationInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent?: { __typename?: 'NoContent', noContent?: boolean | null | undefined } | null | undefined };

export type UpdateEventMutationVariables = Exact<{
  input: UpdateEventMutationInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } };

export type CreateEventsMutationVariables = Exact<{
  input: Array<CreateEventMutationInput> | CreateEventMutationInput;
}>;


export type CreateEventsMutation = { __typename?: 'Mutation', createEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> }> };

export type UpdateEventsMutationVariables = Exact<{
  input: Array<UpdateEventMutationInput> | UpdateEventMutationInput;
}>;


export type UpdateEventsMutation = { __typename?: 'Mutation', updateEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> }> };

export type ExternalLinkFieldsFragment = { __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined };

export type VideoFieldsFragment = { __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined };

export type OfferFieldsFragment = { __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined };

export type BaseEventFieldsFragment = { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> };

export type EventFieldsFragment = { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> };

export type EventQueryVariables = Exact<{
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } };

export type EventsQueryVariables = Exact<{
  adminUser?: InputMaybe<Scalars['Boolean']>;
  createdBy?: InputMaybe<Scalars['String']>;
  combinedText?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  end?: InputMaybe<Scalars['String']>;
  endsAfter?: InputMaybe<Scalars['String']>;
  endsBefore?: InputMaybe<Scalars['String']>;
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>> | InputMaybe<EventTypeId>>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  inLanguage?: InputMaybe<Scalars['String']>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  keywordAnd?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  language?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publicationStatus?: InputMaybe<PublicationStatus>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  showAll?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
  startsAfter?: InputMaybe<Scalars['String']>;
  startsBefore?: InputMaybe<Scalars['String']>;
  superEvent?: InputMaybe<Scalars['ID']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  text?: InputMaybe<Scalars['String']>;
  translation?: InputMaybe<Scalars['String']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'EventsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, superEvent?: { __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, subEvents: Array<{ __typename?: 'Event', id: string, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, createdBy?: string | null | undefined, deleted?: string | null | undefined, endTime?: string | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, eventStatus?: EventStatus | null | undefined, lastModifiedTime?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, publicationStatus?: PublicationStatus | null | undefined, publisher?: string | null | undefined, startTime?: string | null | undefined, superEventType?: SuperEventType | null | undefined, typeId?: EventTypeId | null | undefined, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined>, audience: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, externalLinks: Array<{ __typename?: 'ExternalLink', name?: string | null | undefined, link?: string | null | undefined } | null | undefined>, images: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, inLanguage: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, keywords: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, location?: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined, locationExtraInfo?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null | undefined, description?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, price?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, provider?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, shortDescription?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, videos: Array<{ __typename?: 'Video', altText?: string | null | undefined, name?: string | null | undefined, url?: string | null | undefined } | null | undefined> } | null | undefined> } };

export type PostFeedbackMutationVariables = Exact<{
  input: FeedbackInput;
}>;


export type PostFeedbackMutation = { __typename?: 'Mutation', postFeedback?: { __typename?: 'Feedback', id?: string | null | undefined, name?: string | null | undefined, email?: string | null | undefined, subject?: string | null | undefined, body?: string | null | undefined } | null | undefined };

export type PostGuestFeedbackMutationVariables = Exact<{
  input: FeedbackInput;
}>;


export type PostGuestFeedbackMutation = { __typename?: 'Mutation', postGuestFeedback?: { __typename?: 'Feedback', id?: string | null | undefined, name?: string | null | undefined, email?: string | null | undefined, subject?: string | null | undefined, body?: string | null | undefined } | null | undefined };

export type FeedbackFieldsFragment = { __typename?: 'Feedback', id?: string | null | undefined, name?: string | null | undefined, email?: string | null | undefined, subject?: string | null | undefined, body?: string | null | undefined };

export type LocalisedFieldsFragment = { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined };

export type MetaFieldsFragment = { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined };

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageMutationInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', updateImage: { __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } };

export type UploadImageMutationVariables = Exact<{
  input: UploadImageMutationInput;
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } };

export type ImageFieldsFragment = { __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined };

export type ImageQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type ImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } };

export type ImagesQueryVariables = Exact<{
  dataSource?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publisher?: InputMaybe<Scalars['ID']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type ImagesQuery = { __typename?: 'Query', images: { __typename?: 'ImagesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Image', id?: string | null | undefined, atId: string, altText?: string | null | undefined, license?: string | null | undefined, name?: string | null | undefined, photographerName?: string | null | undefined, publisher?: string | null | undefined, url?: string | null | undefined } | null | undefined> } };

export type KeywordFieldsFragment = { __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined };

export type KeywordQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type KeywordQuery = { __typename?: 'Query', keyword: { __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } };

export type KeywordsQueryVariables = Exact<{
  dataSource?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  freeText?: InputMaybe<Scalars['String']>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type KeywordsQuery = { __typename?: 'Query', keywords: { __typename?: 'KeywordsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> } };

export type KeywordSetFieldsFragment = { __typename?: 'KeywordSet', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, keywords?: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined };

export type KeywordSetQueryVariables = Exact<{
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type KeywordSetQuery = { __typename?: 'Query', keywordSet?: { __typename?: 'KeywordSet', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, keywords?: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined };

export type KeywordSetsQueryVariables = Exact<{
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type KeywordSetsQuery = { __typename?: 'Query', keywordSets: { __typename?: 'KeywordSetsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'KeywordSet', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, keywords?: Array<{ __typename?: 'Keyword', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> } };

export type LanguageFieldsFragment = { __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined };

export type LanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesQuery = { __typename?: 'Query', languages: { __typename?: 'LanguagesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Language', id?: string | null | undefined, atId: string, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined> } };

export type OrganizationFieldsFragment = { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null | undefined> | null | undefined, atId: string, classification?: string | null | undefined, createdTime?: string | null | undefined, dataSource?: string | null | undefined, dissolutionDate?: string | null | undefined, foundingDate?: string | null | undefined, hasRegularUsers?: boolean | null | undefined, id?: string | null | undefined, isAffiliated?: boolean | null | undefined, lastModifiedTime?: string | null | undefined, name?: string | null | undefined, parentOrganization?: string | null | undefined, replacedBy?: string | null | undefined, subOrganizations?: Array<string | null | undefined> | null | undefined };

export type OrganizationQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type OrganizationQuery = { __typename?: 'Query', organization: { __typename?: 'Organization', affiliatedOrganizations?: Array<string | null | undefined> | null | undefined, atId: string, classification?: string | null | undefined, createdTime?: string | null | undefined, dataSource?: string | null | undefined, dissolutionDate?: string | null | undefined, foundingDate?: string | null | undefined, hasRegularUsers?: boolean | null | undefined, id?: string | null | undefined, isAffiliated?: boolean | null | undefined, lastModifiedTime?: string | null | undefined, name?: string | null | undefined, parentOrganization?: string | null | undefined, replacedBy?: string | null | undefined, subOrganizations?: Array<string | null | undefined> | null | undefined } };

export type OrganizationsQueryVariables = Exact<{
  child?: InputMaybe<Scalars['ID']>;
  createPath?: InputMaybe<Scalars['Any']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
}>;


export type OrganizationsQuery = { __typename?: 'Query', organizations: { __typename?: 'OrganizationsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Organization', affiliatedOrganizations?: Array<string | null | undefined> | null | undefined, atId: string, classification?: string | null | undefined, createdTime?: string | null | undefined, dataSource?: string | null | undefined, dissolutionDate?: string | null | undefined, foundingDate?: string | null | undefined, hasRegularUsers?: boolean | null | undefined, id?: string | null | undefined, isAffiliated?: boolean | null | undefined, lastModifiedTime?: string | null | undefined, name?: string | null | undefined, parentOrganization?: string | null | undefined, replacedBy?: string | null | undefined, subOrganizations?: Array<string | null | undefined> | null | undefined } | null | undefined> } };

export type DivisionFieldsFragment = { __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined };

export type PositionFieldsFragment = { __typename?: 'Position', coordinates: Array<number | null | undefined> };

export type PlaceFieldsFragment = { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined };

export type PlaceQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type PlaceQuery = { __typename?: 'Query', place: { __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } };

export type PlacesQueryVariables = Exact<{
  dataSource?: InputMaybe<Scalars['String']>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  hasUpcomingEvents?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type PlacesQuery = { __typename?: 'Query', places: { __typename?: 'PlacesResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Place', id?: string | null | undefined, atId: string, dataSource?: string | null | undefined, email?: string | null | undefined, hasUpcomingEvents?: boolean | null | undefined, nEvents?: number | null | undefined, postalCode?: string | null | undefined, addressLocality?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, divisions: Array<{ __typename?: 'Division', type?: string | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined } | null | undefined>, infoUrl?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, name?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, streetAddress?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, telephone?: { __typename?: 'LocalisedObject', ar?: string | null | undefined, en?: string | null | undefined, fi?: string | null | undefined, ru?: string | null | undefined, sv?: string | null | undefined, zhHans?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', coordinates: Array<number | null | undefined> } | null | undefined } | null | undefined> } };

export type CreateRegistrationMutationVariables = Exact<{
  input: CreateRegistrationMutationInput;
}>;


export type CreateRegistrationMutation = { __typename?: 'Mutation', createRegistration: { __typename?: 'Registration', id?: string | null | undefined, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, confirmationMessage?: string | null | undefined, createdBy?: string | null | undefined, currentAttendeeCount?: number | null | undefined, currentWaitingListCount?: number | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, event?: string | null | undefined, instructions?: string | null | undefined, lastModifiedAt?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, waitingListCapacity?: number | null | undefined, signups?: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> | null | undefined } };

export type DeleteRegistrationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRegistrationMutation = { __typename?: 'Mutation', deleteRegistration?: { __typename?: 'NoContent', noContent?: boolean | null | undefined } | null | undefined };

export type UpdateRegistrationMutationVariables = Exact<{
  input: UpdateRegistrationMutationInput;
}>;


export type UpdateRegistrationMutation = { __typename?: 'Mutation', updateRegistration: { __typename?: 'Registration', id?: string | null | undefined, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, confirmationMessage?: string | null | undefined, createdBy?: string | null | undefined, currentAttendeeCount?: number | null | undefined, currentWaitingListCount?: number | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, event?: string | null | undefined, instructions?: string | null | undefined, lastModifiedAt?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, waitingListCapacity?: number | null | undefined, signups?: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> | null | undefined } };

export type RegistrationFieldsFragment = { __typename?: 'Registration', id?: string | null | undefined, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, confirmationMessage?: string | null | undefined, createdBy?: string | null | undefined, currentAttendeeCount?: number | null | undefined, currentWaitingListCount?: number | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, event?: string | null | undefined, instructions?: string | null | undefined, lastModifiedAt?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, waitingListCapacity?: number | null | undefined, signups?: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> | null | undefined };

export type RegistrationQueryVariables = Exact<{
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type RegistrationQuery = { __typename?: 'Query', registration: { __typename?: 'Registration', id?: string | null | undefined, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, confirmationMessage?: string | null | undefined, createdBy?: string | null | undefined, currentAttendeeCount?: number | null | undefined, currentWaitingListCount?: number | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, event?: string | null | undefined, instructions?: string | null | undefined, lastModifiedAt?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, waitingListCapacity?: number | null | undefined, signups?: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> | null | undefined } };

export type RegistrationsQueryVariables = Exact<{
  eventType?: InputMaybe<Array<InputMaybe<EventTypeId>> | InputMaybe<EventTypeId>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type RegistrationsQuery = { __typename?: 'Query', registrations: { __typename?: 'RegistrationsResponse', meta: { __typename?: 'Meta', count: number, next?: string | null | undefined, previous?: string | null | undefined }, data: Array<{ __typename?: 'Registration', id?: string | null | undefined, atId: string, audienceMaxAge?: number | null | undefined, audienceMinAge?: number | null | undefined, confirmationMessage?: string | null | undefined, createdBy?: string | null | undefined, currentAttendeeCount?: number | null | undefined, currentWaitingListCount?: number | null | undefined, enrolmentEndTime?: string | null | undefined, enrolmentStartTime?: string | null | undefined, event?: string | null | undefined, instructions?: string | null | undefined, lastModifiedAt?: string | null | undefined, maximumAttendeeCapacity?: number | null | undefined, minimumAttendeeCapacity?: number | null | undefined, waitingListCapacity?: number | null | undefined, signups?: Array<{ __typename?: 'Enrolment', id: string, attendeeStatus?: AttendeeStatus | null | undefined, cancellationCode?: string | null | undefined, city?: string | null | undefined, dateOfBirth?: string | null | undefined, email?: string | null | undefined, extraInfo?: string | null | undefined, membershipNumber?: string | null | undefined, name?: string | null | undefined, nativeLanguage?: string | null | undefined, notifications?: string | null | undefined, phoneNumber?: string | null | undefined, serviceLanguage?: string | null | undefined, streetAddress?: string | null | undefined, zipcode?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> } };

export type UserFieldsFragment = { __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null | undefined, departmentName?: string | null | undefined, displayName?: string | null | undefined, email?: string | null | undefined, firstName?: string | null | undefined, isStaff?: boolean | null | undefined, lastLogin?: string | null | undefined, lastName?: string | null | undefined, organization?: string | null | undefined, organizationMemberships: Array<string>, username?: string | null | undefined, uuid?: string | null | undefined };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
  createPath?: InputMaybe<Scalars['Any']>;
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', adminOrganizations: Array<string>, dateJoined?: string | null | undefined, departmentName?: string | null | undefined, displayName?: string | null | undefined, email?: string | null | undefined, firstName?: string | null | undefined, isStaff?: boolean | null | undefined, lastLogin?: string | null | undefined, lastName?: string | null | undefined, organization?: string | null | undefined, organizationMemberships: Array<string>, username?: string | null | undefined, uuid?: string | null | undefined } };

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
  hasUpcomingEvents
  name {
    ...localisedFields
  }
  nEvents
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
  dataSource
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
    ${LocalisedFieldsFragmentDoc}
${DivisionFieldsFragmentDoc}
${PositionFieldsFragmentDoc}`;
export const OfferFieldsFragmentDoc = gql`
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
    ${LocalisedFieldsFragmentDoc}`;
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
  shortDescription {
    ...localisedFields
  }
  startTime
  superEventType
  typeId
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
}
    ${KeywordFieldsFragmentDoc}
${LocalisedFieldsFragmentDoc}`;
export const OrganizationFieldsFragmentDoc = gql`
    fragment organizationFields on Organization {
  affiliatedOrganizations
  atId
  classification
  createdTime
  dataSource
  dissolutionDate
  foundingDate
  hasRegularUsers
  id
  isAffiliated
  lastModifiedTime
  name
  parentOrganization
  replacedBy
  subOrganizations
}
    `;
export const EnrolmentFieldsFragmentDoc = gql`
    fragment enrolmentFields on Enrolment {
  id
  attendeeStatus
  cancellationCode
  city
  dateOfBirth
  email
  extraInfo
  membershipNumber
  name
  nativeLanguage
  notifications
  phoneNumber
  serviceLanguage
  streetAddress
  zipcode
}
    `;
export const RegistrationFieldsFragmentDoc = gql`
    fragment registrationFields on Registration {
  id
  atId
  audienceMaxAge
  audienceMinAge
  confirmationMessage
  createdBy
  currentAttendeeCount
  currentWaitingListCount
  enrolmentEndTime
  enrolmentStartTime
  event
  instructions
  lastModifiedAt
  maximumAttendeeCapacity
  minimumAttendeeCapacity
  signups {
    ...enrolmentFields
  }
  waitingListCapacity
}
    ${EnrolmentFieldsFragmentDoc}`;
export const UserFieldsFragmentDoc = gql`
    fragment userFields on User {
  adminOrganizations
  dateJoined
  departmentName
  displayName
  email
  firstName
  isStaff
  lastLogin
  lastName
  organization
  organizationMemberships
  username
  uuid
}
    `;
export const CreateEnrolmentDocument = gql`
    mutation CreateEnrolment($input: CreateEnrolmentMutationInput!) {
  createEnrolment(input: $input) @rest(type: "Enrolment", path: "/signup/", method: "POST", bodyKey: "input") {
    ...enrolmentFields
  }
}
    ${EnrolmentFieldsFragmentDoc}`;
export type CreateEnrolmentMutationFn = Apollo.MutationFunction<CreateEnrolmentMutation, CreateEnrolmentMutationVariables>;

/**
 * __useCreateEnrolmentMutation__
 *
 * To run a mutation, you first call `useCreateEnrolmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEnrolmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEnrolmentMutation, { data, loading, error }] = useCreateEnrolmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEnrolmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateEnrolmentMutation, CreateEnrolmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEnrolmentMutation, CreateEnrolmentMutationVariables>(CreateEnrolmentDocument, options);
      }
export type CreateEnrolmentMutationHookResult = ReturnType<typeof useCreateEnrolmentMutation>;
export type CreateEnrolmentMutationResult = Apollo.MutationResult<CreateEnrolmentMutation>;
export type CreateEnrolmentMutationOptions = Apollo.BaseMutationOptions<CreateEnrolmentMutation, CreateEnrolmentMutationVariables>;
export const DeleteEnrolmentDocument = gql`
    mutation DeleteEnrolment($cancellationCode: String!) {
  deleteEnrolment(cancellationCode: $cancellationCode) @rest(type: "NoContent", path: "/signup/{args.cancellationCode}", method: "DELETE") {
    noContent
  }
}
    `;
export type DeleteEnrolmentMutationFn = Apollo.MutationFunction<DeleteEnrolmentMutation, DeleteEnrolmentMutationVariables>;

/**
 * __useDeleteEnrolmentMutation__
 *
 * To run a mutation, you first call `useDeleteEnrolmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEnrolmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEnrolmentMutation, { data, loading, error }] = useDeleteEnrolmentMutation({
 *   variables: {
 *      cancellationCode: // value for 'cancellationCode'
 *   },
 * });
 */
export function useDeleteEnrolmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEnrolmentMutation, DeleteEnrolmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEnrolmentMutation, DeleteEnrolmentMutationVariables>(DeleteEnrolmentDocument, options);
      }
export type DeleteEnrolmentMutationHookResult = ReturnType<typeof useDeleteEnrolmentMutation>;
export type DeleteEnrolmentMutationResult = Apollo.MutationResult<DeleteEnrolmentMutation>;
export type DeleteEnrolmentMutationOptions = Apollo.BaseMutationOptions<DeleteEnrolmentMutation, DeleteEnrolmentMutationVariables>;
export const UpdateEnrolmentDocument = gql`
    mutation UpdateEnrolment($input: UpdateEnrolmentMutationInput!) {
  updateEnrolment(input: $input) @rest(type: "Enrolment", path: "/signup_edit/{args.input.id}/", method: "PUT", bodyKey: "input") {
    ...enrolmentFields
  }
}
    ${EnrolmentFieldsFragmentDoc}`;
export type UpdateEnrolmentMutationFn = Apollo.MutationFunction<UpdateEnrolmentMutation, UpdateEnrolmentMutationVariables>;

/**
 * __useUpdateEnrolmentMutation__
 *
 * To run a mutation, you first call `useUpdateEnrolmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEnrolmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEnrolmentMutation, { data, loading, error }] = useUpdateEnrolmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEnrolmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEnrolmentMutation, UpdateEnrolmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEnrolmentMutation, UpdateEnrolmentMutationVariables>(UpdateEnrolmentDocument, options);
      }
export type UpdateEnrolmentMutationHookResult = ReturnType<typeof useUpdateEnrolmentMutation>;
export type UpdateEnrolmentMutationResult = Apollo.MutationResult<UpdateEnrolmentMutation>;
export type UpdateEnrolmentMutationOptions = Apollo.BaseMutationOptions<UpdateEnrolmentMutation, UpdateEnrolmentMutationVariables>;
export const EnrolmentDocument = gql`
    query Enrolment($id: ID!, $createPath: Any) {
  enrolment(id: $id) @rest(type: "Enrolment", pathBuilder: $createPath) {
    ...enrolmentFields
  }
}
    ${EnrolmentFieldsFragmentDoc}`;

/**
 * __useEnrolmentQuery__
 *
 * To run a query within a React component, call `useEnrolmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnrolmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnrolmentQuery({
 *   variables: {
 *      id: // value for 'id'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useEnrolmentQuery(baseOptions: Apollo.QueryHookOptions<EnrolmentQuery, EnrolmentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnrolmentQuery, EnrolmentQueryVariables>(EnrolmentDocument, options);
      }
export function useEnrolmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnrolmentQuery, EnrolmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnrolmentQuery, EnrolmentQueryVariables>(EnrolmentDocument, options);
        }
export type EnrolmentQueryHookResult = ReturnType<typeof useEnrolmentQuery>;
export type EnrolmentLazyQueryHookResult = ReturnType<typeof useEnrolmentLazyQuery>;
export type EnrolmentQueryResult = Apollo.QueryResult<EnrolmentQuery, EnrolmentQueryVariables>;
export const EnrolmentsDocument = gql`
    query Enrolments($attendeeStatus: AttendeeStatus, $events: [ID], $registrations: [ID], $text: String, $createPath: Any) {
  enrolments(
    attendeeStatus: $attendeeStatus
    events: $events
    registrations: $registrations
    text: $text
  ) @rest(type: "Enrolment", pathBuilder: $createPath) {
    ...enrolmentFields
  }
}
    ${EnrolmentFieldsFragmentDoc}`;

/**
 * __useEnrolmentsQuery__
 *
 * To run a query within a React component, call `useEnrolmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnrolmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnrolmentsQuery({
 *   variables: {
 *      attendeeStatus: // value for 'attendeeStatus'
 *      events: // value for 'events'
 *      registrations: // value for 'registrations'
 *      text: // value for 'text'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useEnrolmentsQuery(baseOptions?: Apollo.QueryHookOptions<EnrolmentsQuery, EnrolmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnrolmentsQuery, EnrolmentsQueryVariables>(EnrolmentsDocument, options);
      }
export function useEnrolmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnrolmentsQuery, EnrolmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnrolmentsQuery, EnrolmentsQueryVariables>(EnrolmentsDocument, options);
        }
export type EnrolmentsQueryHookResult = ReturnType<typeof useEnrolmentsQuery>;
export type EnrolmentsLazyQueryHookResult = ReturnType<typeof useEnrolmentsLazyQuery>;
export type EnrolmentsQueryResult = Apollo.QueryResult<EnrolmentsQuery, EnrolmentsQueryVariables>;
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
    mutation UpdateEvent($input: UpdateEventMutationInput!) {
  updateEvent(input: $input) @rest(type: "Event", path: "/event/{args.input.id}/", method: "PUT", bodyKey: "input") {
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
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, options);
      }
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, options);
        }
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const EventsDocument = gql`
    query Events($adminUser: Boolean, $createdBy: String, $combinedText: [String], $division: [String], $end: String, $endsAfter: String, $endsBefore: String, $eventType: [EventTypeId], $include: [String], $inLanguage: String, $isFree: Boolean, $keyword: [String], $keywordAnd: [String], $keywordNot: [String], $language: String, $location: [String], $page: Int, $pageSize: Int, $publicationStatus: PublicationStatus, $publisher: [String], $showAll: Boolean, $sort: String, $start: String, $startsAfter: String, $startsBefore: String, $superEvent: ID, $superEventType: [String], $text: String, $translation: String, $createPath: Any) {
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
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
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
export const UpdateImageDocument = gql`
    mutation UpdateImage($input: UpdateImageMutationInput!) {
  updateImage(input: $input) @rest(type: "Image", path: "/image/{args.input.id}/", method: "PUT", bodyKey: "input") {
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
export function useImageQuery(baseOptions: Apollo.QueryHookOptions<ImageQuery, ImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
      }
export function useImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImageQuery, ImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
        }
export type ImageQueryHookResult = ReturnType<typeof useImageQuery>;
export type ImageLazyQueryHookResult = ReturnType<typeof useImageLazyQuery>;
export type ImageQueryResult = Apollo.QueryResult<ImageQuery, ImageQueryVariables>;
export const ImagesDocument = gql`
    query Images($dataSource: String, $page: Int, $pageSize: Int, $publisher: ID, $createPath: Any) {
  images(
    dataSource: $dataSource
    page: $page
    pageSize: $pageSize
    publisher: $publisher
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
 *      dataSource: // value for 'dataSource'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
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
export type ImagesQueryHookResult = ReturnType<typeof useImagesQuery>;
export type ImagesLazyQueryHookResult = ReturnType<typeof useImagesLazyQuery>;
export type ImagesQueryResult = Apollo.QueryResult<ImagesQuery, ImagesQueryVariables>;
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
export function useKeywordQuery(baseOptions: Apollo.QueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
      }
export function useKeywordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
        }
export type KeywordQueryHookResult = ReturnType<typeof useKeywordQuery>;
export type KeywordLazyQueryHookResult = ReturnType<typeof useKeywordLazyQuery>;
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
export type KeywordsQueryHookResult = ReturnType<typeof useKeywordsQuery>;
export type KeywordsLazyQueryHookResult = ReturnType<typeof useKeywordsLazyQuery>;
export type KeywordsQueryResult = Apollo.QueryResult<KeywordsQuery, KeywordsQueryVariables>;
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
export function useKeywordSetQuery(baseOptions: Apollo.QueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
      }
export function useKeywordSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
        }
export type KeywordSetQueryHookResult = ReturnType<typeof useKeywordSetQuery>;
export type KeywordSetLazyQueryHookResult = ReturnType<typeof useKeywordSetLazyQuery>;
export type KeywordSetQueryResult = Apollo.QueryResult<KeywordSetQuery, KeywordSetQueryVariables>;
export const KeywordSetsDocument = gql`
    query KeywordSets($include: [String], $createPath: Any) {
  keywordSets(include: $include) @rest(type: "KeywordSetsResponse", pathBuilder: $createPath) {
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
export type KeywordSetsQueryHookResult = ReturnType<typeof useKeywordSetsQuery>;
export type KeywordSetsLazyQueryHookResult = ReturnType<typeof useKeywordSetsLazyQuery>;
export type KeywordSetsQueryResult = Apollo.QueryResult<KeywordSetsQuery, KeywordSetsQueryVariables>;
export const LanguagesDocument = gql`
    query Languages {
  languages @rest(type: "LanguagesResponse", path: "/language/", method: "GET") {
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
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>;
export type LanguagesLazyQueryHookResult = ReturnType<typeof useLanguagesLazyQuery>;
export type LanguagesQueryResult = Apollo.QueryResult<LanguagesQuery, LanguagesQueryVariables>;
export const OrganizationDocument = gql`
    query Organization($id: ID!, $createPath: Any) {
  organization(id: $id) @rest(type: "Organization", pathBuilder: $createPath) {
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
 *   },
 * });
 */
export function useOrganizationQuery(baseOptions: Apollo.QueryHookOptions<OrganizationQuery, OrganizationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationQuery, OrganizationQueryVariables>(OrganizationDocument, options);
      }
export function useOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationQuery, OrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationQuery, OrganizationQueryVariables>(OrganizationDocument, options);
        }
export type OrganizationQueryHookResult = ReturnType<typeof useOrganizationQuery>;
export type OrganizationLazyQueryHookResult = ReturnType<typeof useOrganizationLazyQuery>;
export type OrganizationQueryResult = Apollo.QueryResult<OrganizationQuery, OrganizationQueryVariables>;
export const OrganizationsDocument = gql`
    query Organizations($child: ID, $createPath: Any, $page: Int, $pageSize: Int) {
  organizations(child: $child, page: $page, pageSize: $pageSize) @rest(type: "OrganizationsResponse", pathBuilder: $createPath) {
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
export type OrganizationsQueryHookResult = ReturnType<typeof useOrganizationsQuery>;
export type OrganizationsLazyQueryHookResult = ReturnType<typeof useOrganizationsLazyQuery>;
export type OrganizationsQueryResult = Apollo.QueryResult<OrganizationsQuery, OrganizationsQueryVariables>;
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
export function usePlaceQuery(baseOptions: Apollo.QueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
      }
export function usePlaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
        }
export type PlaceQueryHookResult = ReturnType<typeof usePlaceQuery>;
export type PlaceLazyQueryHookResult = ReturnType<typeof usePlaceLazyQuery>;
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
export type PlacesQueryHookResult = ReturnType<typeof usePlacesQuery>;
export type PlacesLazyQueryHookResult = ReturnType<typeof usePlacesLazyQuery>;
export type PlacesQueryResult = Apollo.QueryResult<PlacesQuery, PlacesQueryVariables>;
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
    mutation UpdateRegistration($input: UpdateRegistrationMutationInput!) {
  updateRegistration(input: $input) @rest(type: "Registration", path: "/registration/{args.input.id}/", method: "PUT", bodyKey: "input") {
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
export function useRegistrationQuery(baseOptions: Apollo.QueryHookOptions<RegistrationQuery, RegistrationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegistrationQuery, RegistrationQueryVariables>(RegistrationDocument, options);
      }
export function useRegistrationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegistrationQuery, RegistrationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegistrationQuery, RegistrationQueryVariables>(RegistrationDocument, options);
        }
export type RegistrationQueryHookResult = ReturnType<typeof useRegistrationQuery>;
export type RegistrationLazyQueryHookResult = ReturnType<typeof useRegistrationLazyQuery>;
export type RegistrationQueryResult = Apollo.QueryResult<RegistrationQuery, RegistrationQueryVariables>;
export const RegistrationsDocument = gql`
    query Registrations($eventType: [EventTypeId], $page: Int, $pageSize: Int, $text: String, $createPath: Any) {
  registrations(
    eventType: $eventType
    page: $page
    pageSize: $pageSize
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
 *      eventType: // value for 'eventType'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
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
export type RegistrationsQueryHookResult = ReturnType<typeof useRegistrationsQuery>;
export type RegistrationsLazyQueryHookResult = ReturnType<typeof useRegistrationsLazyQuery>;
export type RegistrationsQueryResult = Apollo.QueryResult<RegistrationsQuery, RegistrationsQueryVariables>;
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
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;