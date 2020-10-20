/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import { Language, LanguagesResponse, LocalizedObject } from '../schema';

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
      name: fakeLocalizedObject(),
      __typename: 'Language',
    },
    overrides
  );

export const fakeLocalizedObject = (text?: string): LocalizedObject => ({
  __typename: 'LocalizedObject',
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
