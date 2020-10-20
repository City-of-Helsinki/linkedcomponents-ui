/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import {
  Language,
  LanguagesResponse,
  LocalisedObject,
} from '../generated/graphql';

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
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
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
