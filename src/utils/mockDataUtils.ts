/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import { EXTLINK } from '../constants';
import { NOTIFICATION_TYPE } from '../domain/enrolment/constants';
import {
  TEST_DATA_SOURCE,
  TEST_PUBLISHER_ID,
} from '../domain/organization/constants';
import {
  AttendeeStatus,
  DataSource,
  DataSourcesResponse,
  Enrolment,
  Event,
  EventsResponse,
  EventStatus,
  EventTypeId,
  ExternalLink,
  Feedback,
  Image,
  ImagesResponse,
  Keyword,
  KeywordSet,
  KeywordSetsResponse,
  KeywordsResponse,
  Language,
  LanguagesResponse,
  LocalisedObject,
  Meta,
  Offer,
  Organization,
  OrganizationClass,
  OrganizationClassesResponse,
  OrganizationsResponse,
  Place,
  PlacesResponse,
  PublicationStatus,
  Registration,
  RegistrationsResponse,
  User,
  UsersResponse,
  Video,
} from '../generated/graphql';
import generateAtId from './generateAtId';

export const fakeDataSources = (
  count = 1,
  dataSources?: Partial<DataSource>[]
): DataSourcesResponse => ({
  data: generateNodeArray((i) => fakeDataSource(dataSources?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'DataSourcesResponse',
});

export const fakeDataSource = (overrides?: Partial<DataSource>): DataSource => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<DataSource, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'data_source'),
      apiKey: '',
      createPastEvents: false,
      editPastEvents: false,
      name: faker.random.words(),
      owner: null,
      private: false,
      userEditable: false,
      __typename: 'DataSource',
    },
    overrides
  );
};

export const fakeEnrolments = (
  count = 1,
  enrolments: Partial<Enrolment>[]
): Enrolment[] =>
  generateNodeArray((i) => fakeEnrolment(enrolments?.[i]), count);

export const fakeEnrolment = (overrides?: Partial<Enrolment>): Enrolment => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Enrolment, typeof overrides>(
    {
      id,
      attendeeStatus: AttendeeStatus.Attending,
      cancellationCode: '',
      city: faker.address.city(),
      dateOfBirth: '1990-10-10',
      email: faker.internet.email(),
      extraInfo: faker.lorem.paragraph(),
      membershipNumber: faker.datatype.uuid(),
      name: faker.name.firstName(),
      nativeLanguage: 'fi',
      notifications: NOTIFICATION_TYPE.SMS_EMAIL,
      phoneNumber: faker.phone.phoneNumberFormat(),
      serviceLanguage: 'fi',
      streetAddress: faker.address.streetAddress(),
      zipcode: faker.address.zipCode('#####'),
      __typename: 'Enrolment',
    },
    overrides
  );
};
export const fakeEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventsResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'EventsResponse',
});

export const fakeEvent = (overrides?: Partial<Event>): Event => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Event, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'event'),
      audience: [],
      audienceMaxAge: null,
      audienceMinAge: null,
      createdBy: null,
      dataSource: 'hel',
      datePublished: null,
      deleted: null,
      description: fakeLocalisedObject(),
      endTime: null,
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      eventStatus: EventStatus.EventScheduled,
      externalLinks: [],
      images: [],
      infoUrl: fakeLocalisedObject(),
      inLanguage: [],
      keywords: [],
      lastModifiedTime: '2020-07-13T05:51:05.761000Z',
      location: fakePlace(),
      locationExtraInfo: fakeLocalisedObject(faker.address.streetAddress()),
      maximumAttendeeCapacity: null,
      minimumAttendeeCapacity: null,
      name: fakeLocalisedObject(faker.name.title()),
      offers: [],
      provider: fakeLocalisedObject(),
      publicationStatus: PublicationStatus.Public,
      publisher: 'provider:123',
      shortDescription: fakeLocalisedObject(),
      startTime: '2020-07-13T05:51:05.761000Z',
      subEvents: [],
      superEvent: null,
      superEventType: null,
      typeId: EventTypeId.General,
      videos: [],
      __typename: 'Event',
    },
    overrides
  );
};

export const fakeExternalLink = (
  overrides?: Partial<ExternalLink>
): ExternalLink =>
  merge<ExternalLink, typeof overrides>(
    {
      link: faker.internet.url(),
      name: EXTLINK.EXTLINK_FACEBOOK,
      __typename: 'ExternalLink',
    },
    overrides
  );

export const fakeFeedback = (overrides?: Partial<Feedback>): Feedback =>
  merge<Feedback, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      subject: faker.name.title(),
      body: faker.internet.exampleEmail(),
      __typename: 'Feedback',
    },
    overrides
  );

export const fakeImages = (
  count = 1,
  images?: Partial<Image>[]
): ImagesResponse => ({
  data: generateNodeArray((i) => fakeImage(images?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'ImagesResponse',
});

export const fakeImage = (overrides?: Partial<Image>): Image => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Image, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'image'),
      altText: faker.image.cats(),
      lastModifiedTime: null,
      license: 'cc_by',
      name: faker.random.words(),
      url: faker.internet.url(),
      cropping: '59,0,503,444',
      photographerName: faker.name.firstName(),
      publisher: TEST_PUBLISHER_ID,
      __typename: 'Image',
    },
    overrides
  );
};

export const fakeKeywords = (
  count = 1,
  keywords?: Partial<Keyword>[]
): KeywordsResponse => ({
  data: generateNodeArray((i) => fakeKeyword(keywords?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'KeywordsResponse',
});

export const fakeKeyword = (overrides?: Partial<Keyword>): Keyword => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Keyword, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'keyword'),
      dataSource: 'yso',
      deprecated: false,
      hasUpcomingEvents: true,
      name: fakeLocalisedObject(),
      nEvents: 0,
      publisher: TEST_PUBLISHER_ID,
      replacedBy: null,
      __typename: 'Keyword',
    },
    overrides
  );
};

export const fakeKeywordSets = (
  count = 1,
  keywordSets?: Partial<KeywordSet>[]
): KeywordSetsResponse => ({
  data: generateNodeArray((i) => fakeKeywordSet(keywordSets?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'KeywordSetsResponse',
});

export const fakeKeywordSet = (overrides?: Partial<KeywordSet>): KeywordSet => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<KeywordSet, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'keyword_set'),
      dataSource: TEST_DATA_SOURCE,
      keywords: [],
      name: fakeLocalisedObject(),
      organization: TEST_PUBLISHER_ID,
      usage: 'any',
      __typename: 'KeywordSet',
    },
    overrides
  );
};

export const fakeLanguages = (
  count = 1,
  languages?: Partial<Language>[]
): LanguagesResponse => ({
  data: generateNodeArray((i) => fakeLanguage(languages?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'LanguagesResponse',
});

export const fakeLanguage = (overrides?: Partial<Language>): Language => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Language, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'language'),
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
    },
    overrides
  );
};

export const fakeOffer = (overrides?: Partial<Offer>): Offer =>
  merge(
    {
      description: fakeLocalisedObject(),
      infoUrl: fakeLocalisedObject(faker.internet.url()),
      isFree: false,
      price: fakeLocalisedObject(),
      __typename: 'Offer',
    },
    overrides
  );

export const fakeOffers = (count = 1, offers?: Partial<Offer>[]): Offer[] =>
  generateNodeArray((i) => fakeOffer(offers?.[i]), count);

export const fakeOrganization = (
  overrides?: Partial<Organization>
): Organization => {
  const id = overrides?.id || faker.datatype.uuid();
  return merge<Organization, typeof overrides>(
    {
      adminUsers: [],
      affiliatedOrganizations: [],
      id,
      atId: generateAtId(id, 'organization'),
      classification: faker.random.words(),
      createdTime: null,
      dataSource: faker.datatype.uuid(),
      dissolutionDate: null,
      foundingDate: '2021-01-01',
      hasRegularUsers: false,
      isAffiliated: false,
      lastModifiedTime: null,
      name: faker.random.words(),
      parentOrganization: null,
      replacedBy: null,
      regularUsers: [],
      subOrganizations: [],
      __typename: 'Organization',
    },
    overrides
  );
};

export const fakeOrganizations = (
  count = 1,
  organizations?: Partial<Organization>[]
): OrganizationsResponse => ({
  data: generateNodeArray((i) => fakeOrganization(organizations?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'OrganizationsResponse',
});

export const fakeOrganizationClasses = (
  count = 1,
  organizationClasses?: Partial<OrganizationClass>[]
): OrganizationClassesResponse => ({
  data: generateNodeArray(
    (i) => fakeOrganizationClass(organizationClasses?.[i]),
    count
  ),
  meta: fakeMeta(count),
  __typename: 'OrganizationClassesResponse',
});

export const fakeOrganizationClass = (
  overrides?: Partial<OrganizationClass>
): OrganizationClass => {
  const id = overrides?.id || faker.datatype.uuid();
  return merge<OrganizationClass, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'organization_class'),
      createdTime: null,
      dataSource: TEST_DATA_SOURCE,
      lastModifiedTime: null,
      name: faker.random.words(),
      __typename: 'OrganizationClass',
    },
    overrides
  );
};

export const fakePlaces = (
  count = 1,
  places?: Partial<Place>[]
): PlacesResponse => ({
  data: generateNodeArray((i) => fakePlace(places?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'PlacesResponse',
});

export const fakePlace = (overrides?: Partial<Place>): Place => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Place, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'place'),
      addressLocality: fakeLocalisedObject(),
      addressRegion: '',
      contactType: '',
      dataSource: 'tprek',
      description: fakeLocalisedObject(),
      divisions: [],
      email: faker.internet.email(),
      hasUpcomingEvents: true,
      infoUrl: fakeLocalisedObject(faker.internet.url()),
      name: fakeLocalisedObject(),
      nEvents: 0,
      position: null,
      postalCode: faker.address.zipCode(),
      postOfficeBoxNum: '',
      publisher: TEST_PUBLISHER_ID,
      streetAddress: fakeLocalisedObject(),
      telephone: fakeLocalisedObject(),
      __typename: 'Place',
    },
    overrides
  );
};

export const fakeRegistrations = (
  count = 1,
  registrations?: Partial<Registration>[]
): RegistrationsResponse => ({
  data: generateNodeArray((i) => fakeRegistration(registrations?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'RegistrationsResponse',
});

export const fakeRegistration = (
  overrides?: Partial<Registration>
): Registration => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<Registration, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'registration'),
      audienceMaxAge: null,
      audienceMinAge: null,
      confirmationMessage: faker.lorem.paragraph(),
      createdAt: null,
      createdBy: faker.name.firstName(),
      currentAttendeeCount: 0,
      currentWaitingListCount: 0,
      enrolmentEndTime: '2020-09-30T16:00:00.000000Z',
      enrolmentStartTime: '2020-09-27T15:00:00.000000Z',
      event: null,
      instructions: faker.lorem.paragraph(),
      lastModifiedAt: '2020-09-12T15:00:00.000000Z',
      lastModifiedBy: faker.name.firstName(),
      maximumAttendeeCapacity: 0,
      minimumAttendeeCapacity: 0,
      signups: [],
      waitingListCapacity: 0,
      __typename: 'Registration',
    },
    overrides
  );
};

export const fakeUsers = (
  count = 1,
  users?: Partial<User>[]
): UsersResponse => ({
  data: generateNodeArray((i) => fakeUser(users?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'UsersResponse',
});

export const fakeUser = (overrides?: Partial<User>): User => {
  return merge<User, typeof overrides>(
    {
      adminOrganizations: [],
      dateJoined: null,
      departmentName: faker.random.words(),
      displayName: faker.random.words(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      isStaff: false,
      lastLogin: '',
      lastName: faker.name.lastName(),
      organization: faker.random.words(),
      organizationMemberships: [],
      username: faker.datatype.uuid(),
      uuid: faker.datatype.uuid(),
      __typename: 'User',
    },
    overrides
  );
};

export const fakeVideo = (overrides?: Partial<Video>): Video =>
  merge<Video, typeof overrides>(
    {
      altText: faker.random.image(),
      name: faker.random.image(),
      url: faker.internet.url(),
      __typename: 'Video',
    },
    overrides
  );

export const fakeLocalisedObject = (text?: string): LocalisedObject => ({
  __typename: 'LocalisedObject',
  ar: faker.random.words(),
  en: faker.random.words(),
  fi: text || faker.random.words(),
  ru: faker.random.words(),
  sv: faker.random.words(),
  zhHans: faker.random.words(),
});

export const fakeMeta = (count = 1, overrides?: Partial<Meta>): Meta =>
  merge<Meta, typeof overrides>(
    {
      __typename: 'Meta',
      count: count,
      next: '',
      previous: '',
    },
    overrides
  );

const generateNodeArray = <T extends (...args: any) => any>(
  fakeFunc: T,
  length: number
): ReturnType<T>[] => {
  return Array.from({ length }).map((_, i) => fakeFunc(i));
};
