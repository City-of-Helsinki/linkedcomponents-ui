/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import { EXTLINK } from '../constants';
import {
  Event,
  EventsResponse,
  ExternalLink,
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
  Organization,
  Place,
  PlacesResponse,
  PublicationStatus,
  User,
} from '../generated/graphql';

export const fakeEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventsResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'EventsResponse',
});

export const fakeEvent = (overrides?: Partial<Event>): Event => {
  const id = overrides?.id || faker.random.uuid();

  return merge<Event, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/event/${id}/`,
      audienceMaxAge: null,
      audienceMinAge: null,
      name: fakeLocalisedObject(faker.name.title()),
      publisher: 'provider:123',
      provider: fakeLocalisedObject(),
      shortDescription: fakeLocalisedObject(),
      description: fakeLocalisedObject(),
      images: [fakeImage()],
      infoUrl: fakeLocalisedObject(),
      inLanguage: [fakeLanguage()],
      audience: [],
      keywords: [fakeKeyword()],
      location: fakePlace(),
      startTime: '2020-07-13T05:51:05.761000Z',
      endTime: null,
      datePublished: null,
      externalLinks: [fakeExternalLink()],
      offers: [] as any,
      subEvents: [] as any,
      publicationStatus: PublicationStatus.Public,
      eventStatus: 'EventScheduled',
      superEvent: null,
      dataSource: 'hel',
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

export const fakeImages = (
  count = 1,
  images?: Partial<Image>[]
): ImagesResponse => ({
  data: generateNodeArray((i) => fakeImage(images?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'ImagesResponse',
});

export const fakeImage = (overrides?: Partial<Image>): Image => {
  const id = overrides?.id || faker.random.uuid();

  return merge<Image, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/image/${id}/`,
      altText: faker.image.cats(),
      license: 'cc_by',
      name: faker.random.words(),
      url: faker.internet.url(),
      cropping: '59,0,503,444',
      photographerName: faker.name.firstName(),
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
  const id = overrides?.id || faker.random.uuid();

  return merge<Keyword, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/keyword/${id}/`,
      dataSource: 'yso',
      hasUpcomingEvents: true,
      name: fakeLocalisedObject(),
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
  const id = overrides?.id || faker.random.uuid();

  return merge<KeywordSet, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/keyword_set/${id}/`,
      dataSource: 'helsinki',
      keywords: [],
      name: fakeLocalisedObject(),
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
  const id = overrides?.id || faker.random.uuid();

  return merge<Language, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/language/${id}/`,
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
    },
    overrides
  );
};

export const fakeOrganization = (
  overrides?: Partial<Organization>
): Organization => {
  const id = overrides?.id || faker.random.uuid();
  return merge<Organization, typeof overrides>(
    {
      affiliatedOrganizations: [],
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/organization/${id}/`,
      classification: faker.random.words(),
      createdTime: null,
      dataSource: faker.random.uuid(),
      dissolutionDate: null,
      foundingDate: null,
      hasRegularUsers: false,
      isAffiliated: false,
      lastModifiedTime: null,
      name: faker.random.words(),
      parentOrganization: null,
      replacedBy: null,
      subOrganizations: [],
      __typename: 'Organization',
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
  const id = overrides?.id || faker.random.uuid();

  return merge<Place, typeof overrides>(
    {
      id,
      atId: `https://api.hel.fi/linkedevents-test/v1/place/${id}/`,
      name: fakeLocalisedObject(),
      streetAddress: fakeLocalisedObject(),
      addressLocality: fakeLocalisedObject(),
      postalCode: faker.address.zipCode(),
      hasUpcomingEvents: true,
      telephone: fakeLocalisedObject(),
      email: faker.internet.email(),
      infoUrl: fakeLocalisedObject(faker.internet.url()),
      position: null,
      divisions: [],
      __typename: 'Place',
    },
    overrides
  );
};

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
      lastLogin: faker.name.lastName(),
      lastName: faker.name.lastName(),
      organization: faker.random.words(),
      organizationMemberships: [],
      username: faker.name.lastName(),
      uuid: faker.random.uuid(),
      __typename: 'User',
    },
    overrides
  );
};

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
