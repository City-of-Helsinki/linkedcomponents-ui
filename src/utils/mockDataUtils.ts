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
  Place,
  PlacesResponse,
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
  return merge<Event, typeof overrides>(
    {
      id: `hel:${faker.random.uuid()}`,
      atId: faker.random.uuid(),
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
  const id = faker.random.uuid();

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

export const fakeKeyword = (overrides?: Partial<Keyword>): Keyword =>
  merge<Keyword, typeof overrides>(
    {
      id: faker.random.uuid(),
      atId: 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p4363/',
      dataSource: 'yso',
      hasUpcomingEvents: true,
      name: fakeLocalisedObject(),
      __typename: 'Keyword',
    },
    overrides
  );

export const fakeKeywordSets = (
  count = 1,
  keywordSets?: Partial<KeywordSet>[]
): KeywordSetsResponse => ({
  data: generateNodeArray((i) => fakeKeywordSet(keywordSets?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'KeywordSetsResponse',
});

export const fakeKeywordSet = (overrides?: Partial<KeywordSet>): KeywordSet =>
  merge<KeywordSet, typeof overrides>(
    {
      id: faker.random.uuid(),
      atId:
        'https://api.hel.fi/linkedevents-test/v1/keyword_set/helsinki:audience/',
      dataSource: 'helsinki',
      keywords: [],
      name: fakeLocalisedObject(),
      __typename: 'KeywordSet',
    },
    overrides
  );

export const fakeLanguages = (
  count = 1,
  languages?: Partial<Language>[]
): LanguagesResponse => ({
  data: generateNodeArray((i) => fakeLanguage(languages?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'LanguagesResponse',
});

export const fakeLanguage = (overrides?: Partial<Language>): Language =>
  merge<Language, typeof overrides>(
    {
      id: faker.random.uuid(),
      atId: 'https://api.hel.fi/linkedevents-test/v1/language/en/',
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
    },
    overrides
  );

export const fakePlaces = (
  count = 1,
  places?: Partial<Place>[]
): PlacesResponse => ({
  data: generateNodeArray((i) => fakePlace(places?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'PlacesResponse',
});

export const fakePlace = (overrides?: Partial<Place>): Place =>
  merge<Place, typeof overrides>(
    {
      id: faker.random.uuid(),
      atId: 'https://api.hel.fi/linkedevents-test/v1/place/tprek:15376/',
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

export const fakeLocalisedObject = (text?: string): LocalisedObject => ({
  __typename: 'LocalisedObject',
  en: faker.random.words(),
  sv: faker.random.words(),
  fi: text || faker.random.words(),
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
