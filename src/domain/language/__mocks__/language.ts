import { MockedResponse } from '@apollo/client/testing';

import { LanguagesDocument } from '../../../generated/graphql';
import {
  fakeLanguages,
  fakeLocalisedObject,
} from '../../../utils/mockDataUtils';

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
const mockedLanguagesResponse: MockedResponse = {
  request: { query: LanguagesDocument },
  result: languagesResponse,
};

export { languages, languagesResponse, mockedLanguagesResponse };
