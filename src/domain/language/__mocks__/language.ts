import { MockedResponse } from '@apollo/client/testing';

import { LanguagesDocument } from '../../../generated/graphql';
import {
  fakeLanguages,
  fakeLocalisedObject,
} from '../../../utils/mockDataUtils';
import skipFalsyType from '../../../utils/skipFalsyType';

const languagesData = [
  {
    id: 'en',
    name: { ...fakeLocalisedObject('englanti') },
  },
  {
    id: 'sv',
    name: { ...fakeLocalisedObject('ruotsi') },
  },
  {
    id: 'fi',
    name: { ...fakeLocalisedObject('suomi') },
  },
  {
    id: 'ru',
    name: { ...fakeLocalisedObject('venäjä') },
  },
  {
    id: 'et',
    name: { ...fakeLocalisedObject('viro') },
  },
  {
    id: 'fr',
    name: { ...fakeLocalisedObject('ranska') },
  },
  {
    id: 'so',
    name: { ...fakeLocalisedObject('somali') },
  },
  {
    id: 'es',
    name: { ...fakeLocalisedObject('espanja') },
  },
  {
    id: 'tr',
    name: { ...fakeLocalisedObject('turkki') },
  },
  {
    id: 'fa',
    name: { ...fakeLocalisedObject('persia') },
  },
  {
    id: 'ar',
    name: { ...fakeLocalisedObject('arabia') },
  },
  {
    id: 'zh_hans',
    name: { ...fakeLocalisedObject('kiina') },
  },
];

const languages = fakeLanguages(languagesData.length, languagesData);
const languagesResponse = { data: { languages } };
const languagesVariables = { createPath: undefined };
const mockedLanguagesResponse: MockedResponse = {
  request: { query: LanguagesDocument },
  result: languagesResponse,
};

const serviceLanguageOverrides = languages.data
  .filter(skipFalsyType)
  .filter((l) => ['en', 'fi', 'sv'].includes(l.id as string))
  .map((l) => ({ ...l, serviceLanguage: true }));

const serviceLanguages = fakeLanguages(
  serviceLanguageOverrides.length,
  serviceLanguageOverrides
);
const serviceLanguagesResponse = { data: { languages: serviceLanguages } };
const serviceLanguagesVariables = {
  ...languagesVariables,
  serviceLanguage: true,
};
const mockedServiceLanguagesResponse: MockedResponse = {
  request: { query: LanguagesDocument, variables: serviceLanguagesVariables },
  result: serviceLanguagesResponse,
};

export {
  languages,
  languagesResponse,
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
};
