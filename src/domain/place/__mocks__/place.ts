import { MockedResponse } from '@apollo/client/testing';

import {
  PlaceDocument,
  PlaceFieldsFragment,
  PlacesDocument,
} from '../../../generated/graphql';
import generateAtId from '../../../utils/generateAtId';
import { fakePlace, fakePlaces } from '../../../utils/mockDataUtils';
import { TEST_PLACE_ID } from '../constants';

const locationName = 'Location name';
const streetAddress = 'Venue address';
const addressLocality = 'Helsinki';
const placeId = TEST_PLACE_ID;
const placeAtId = generateAtId(placeId, 'place');

const placeOverrides = {
  id: placeId,
  atId: placeAtId,
  addressLocality: { fi: addressLocality },
  name: { fi: locationName },
  streetAddress: { fi: streetAddress },
};

const locationText = `${locationName} (${streetAddress}, ${addressLocality})`;

const place = fakePlace({ ...placeOverrides }) as PlaceFieldsFragment;
const places = fakePlaces(1, [place]);

const placeResponse = { data: { place } };
const placeVariables = { id: TEST_PLACE_ID, createPath: undefined };
const mockedPlaceResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

// Place mocks
const placesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse: MockedResponse = {
  request: { query: PlacesDocument, variables: placesVariables },
  result: placesResponse,
};

const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: locationText,
};
const mockedFilteredPlacesResponse: MockedResponse = {
  request: { query: PlacesDocument, variables: filteredPlacesVariables },
  result: placesResponse,
};

export {
  addressLocality,
  locationName,
  locationText,
  mockedFilteredPlacesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  place,
  placeAtId,
  placeId,
  placeOverrides,
  streetAddress,
};
