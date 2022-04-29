import { MockedResponse } from '@apollo/client/testing';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import {
  DeletePlaceDocument,
  PlaceDocument,
  PlaceFieldsFragment,
  UpdatePlaceDocument,
} from '../../../generated/graphql';
import { fakePlace } from '../../../utils/mockDataUtils';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PLACE_ID } from '../constants';

const placeValues: Partial<PlaceFieldsFragment> = {
  addressLocality: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Helsinki' },
  dataSource: TEST_DATA_SOURCE_ID,
  description: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Place description' },
  email: 'test@email.com',
  id: TEST_PLACE_ID,
  infoUrl: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'http://www.info.com' },
  name: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Place (fi)' },
  position: { coordinates: [24.924889, 60.159661] },
  postalCode: '00100',
  publisher: TEST_PUBLISHER_ID,
  streetAddress: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Street address' },
  telephone: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: '+358441234567' },
};

const place = fakePlace(placeValues);

const placeVariables = { id: place.id, createPath: undefined };
const placeResponse = { data: { place } };
const mockedPlaceResponse: MockedResponse = {
  request: { query: PlaceDocument, variables: placeVariables },
  result: placeResponse,
};

const deletePlaceVariables = { id: place.id };
const deletePlaceResponse = { data: { deletePlace: null } };
const mockedDeletePlaceResponse: MockedResponse = {
  request: { query: DeletePlaceDocument, variables: deletePlaceVariables },
  result: deletePlaceResponse,
};

const emptyLangObj = { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' };

const payload = {
  addressLocality: { ...emptyLangObj, fi: placeValues.addressLocality.fi },
  addressRegion: '',
  contactType: '',
  dataSource: placeValues.dataSource,
  description: { ...emptyLangObj, fi: placeValues.description.fi },
  email: placeValues.email,
  infoUrl: { ...emptyLangObj, fi: placeValues.infoUrl.fi },
  name: { ...emptyLangObj, fi: placeValues.name.fi },
  position: { type: 'Point', coordinates: placeValues.position.coordinates },
  postOfficeBoxNum: '',
  postalCode: placeValues.postalCode,
  publisher: placeValues.publisher,
  streetAddress: { ...emptyLangObj, fi: placeValues.streetAddress.fi },
  telephone: { ...emptyLangObj, fi: placeValues.telephone.fi },
  id: placeValues.id,
  originId: placeValues.id.split(':')[1],
};

const updatePlaceVariables = { input: payload };

const updatePlaceResponse = { data: { updatePlace: place } };

const mockedUpdatePlaceResponse: MockedResponse = {
  request: { query: UpdatePlaceDocument, variables: updatePlaceVariables },
  result: updatePlaceResponse,
};

const mockedInvalidUpdatePlaceResponse: MockedResponse = {
  request: { query: UpdatePlaceDocument, variables: updatePlaceVariables },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

export {
  mockedDeletePlaceResponse,
  mockedInvalidUpdatePlaceResponse,
  mockedPlaceResponse,
  mockedUpdatePlaceResponse,
  place,
  placeVariables,
};
