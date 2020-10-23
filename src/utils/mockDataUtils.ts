/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import { EXTLINK } from '../constants';
import {
  Event,
  EventsResponse,
  ExternalLink,
  Image,
  Keyword,
  Language,
  LanguagesResponse,
  LocalisedObject,
  Place,
} from '../generated/graphql';

export const fakeEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventsResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  meta: {
    __typename: 'Meta',
    count: count,
    next: '',
    previous: '',
  },
  __typename: 'EventsResponse',
});

export const fakeEvent = (overrides?: Partial<Event>): Event => {
  return merge(
    {
      id: `hel:${faker.random.uuid()}`,
      internalId: faker.random.uuid(),
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
  merge(
    {
      link: faker.internet.url(),
      name: EXTLINK.EXTLINK_FACEBOOK,
      __typename: 'ExternalLink',
    },
    overrides
  );

export const fakeImage = (overrides?: Partial<Image>): Image =>
  merge(
    {
      id: faker.random.uuid(),
      internalId: 'https://api.hel.fi/linkedevents-test/v1/image/48566/',
      license: 'cc_by',
      name: faker.random.words(),
      url: 'https://api.hel.fi/linkedevents-test/media/images/test.png',
      cropping: '59,0,503,444',
      photographerName: faker.name.firstName(),
      __typename: 'Image',
    },
    overrides
  );

export const fakeKeyword = (overrides?: Partial<Keyword>): Keyword =>
  merge(
    {
      id: faker.random.uuid(),
      dataSource: 'yso',
      hasUpcomingEvents: true,
      name: fakeLocalisedObject(),
      internalId: 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p4363/',
      __typename: 'Keyword',
    },
    overrides
  );

export const fakeLanguages = (
  count = 1,
  languages?: Partial<Language>[]
): LanguagesResponse => ({
  data: generateNodeArray((i) => fakeLanguage(languages?.[i]), count),
  meta: {
    count: count,
    next: '',
    previous: '',
    __typename: 'Meta',
  },
  __typename: 'LanguagesResponse',
});

export const fakeLanguage = (overrides?: Partial<Language>): Language =>
  merge(
    {
      id: faker.random.uuid(),
      internalId: 'https://api.hel.fi/linkedevents-test/v1/language/en/',
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
    },
    overrides
  );

export const fakePlace = (overrides?: Partial<Place>): Place =>
  merge(
    {
      id: faker.random.uuid(),
      internalId: 'https://api.hel.fi/linkedevents-test/v1/place/tprek:15376/',
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

const generateNodeArray = <T extends (...args: any) => any>(
  fakeFunc: T,
  length: number
): ReturnType<T>[] => {
  return Array.from({ length }).map((_, i) => fakeFunc(i));
};
