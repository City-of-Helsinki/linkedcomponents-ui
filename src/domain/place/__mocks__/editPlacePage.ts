import { MockedResponse } from '@apollo/client/testing';

import {
  DeletePlaceDocument,
  PlaceDocument,
  PlaceFieldsFragment,
} from '../../../generated/graphql';
import { fakePlace } from '../../../utils/mockDataUtils';
import {
  TEST_DATA_SOURCE,
  TEST_PUBLISHER_ID,
} from '../../organization/constants';
import { TEST_PLACE_ID } from '../constants';

const placeValues: Partial<PlaceFieldsFragment> = {
  dataSource: TEST_DATA_SOURCE,
  id: TEST_PLACE_ID,
  name: {
    ar: 'Place (ar)',
    en: 'Place (en)',
    fi: 'Place (fi)',
    ru: 'Place (ru)',
    sv: 'Place (sv)',
    zhHans: 'Place (zhHans)',
  },
  publisher: TEST_PUBLISHER_ID,
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

export {
  mockedDeletePlaceResponse,
  mockedPlaceResponse,
  place,
  placeVariables,
};
