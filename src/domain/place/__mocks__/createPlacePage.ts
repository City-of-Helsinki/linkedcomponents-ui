import { MockedResponse } from '@apollo/client/testing';

import { CreatePlaceDocument } from '../../../generated/graphql';
import { fakePlace } from '../../../utils/mockDataUtils';

const placeValues = { name: 'Place name', originId: '123' };

const payload = {
  addressLocality: { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' },
  addressRegion: '',
  contactType: '',
  dataSource: 'helsinki',
  description: { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' },
  email: '',
  infoUrl: { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' },
  name: { fi: placeValues.name, sv: '', en: '', ru: '', zhHans: '', ar: '' },
  postalCode: '',
  postOfficeBoxNum: '',
  publisher: 'publisher:1',
  streetAddress: { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' },
  telephone: { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' },
  id: 'helsinki:123',
  originId: placeValues.originId,
  position: null,
};

const createPlaceVariables = { input: payload };

const createPlaceResponse = { data: { createPlace: fakePlace() } };

const mockedCreatePlaceResponse: MockedResponse = {
  request: { query: CreatePlaceDocument, variables: createPlaceVariables },
  result: createPlaceResponse,
};

const mockedInvalidCreatePlaceResponse: MockedResponse = {
  request: { query: CreatePlaceDocument, variables: createPlaceVariables },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  mockedCreatePlaceResponse,
  mockedInvalidCreatePlaceResponse,
  placeValues,
};
