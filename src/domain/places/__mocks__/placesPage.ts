import range from 'lodash/range';

import { Meta, PlacesDocument } from '../../../generated/graphql';
import { fakePlaces } from '../../../utils/mockDataUtils';
import {
  DEFAULT_PLACE_SORT,
  PLACE_SORT_OPTIONS,
  PLACES_PAGE_SIZE,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const variables = {
  createPath: undefined,
  page: 1,
  pageSize: PLACES_PAGE_SIZE,
  showAllPlaces: true,
  sort: DEFAULT_PLACE_SORT,
  text: '',
};

const placeNames = range(1, TEST_PAGE_SIZE + 1).map((n) => `Place name ${n}`);
const places = fakePlaces(
  TEST_PAGE_SIZE,
  placeNames.map((name) => ({ name: { fi: name } }))
);

const count = 30;
const meta: Meta = { ...places.meta, count };
const placesResponse = { data: { places: { ...places, meta } } };
const mockedPlacesResponse = {
  request: { query: PlacesDocument, variables },
  result: placesResponse,
};

const page2PlaceNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 place ${n}`
);
const page2Places = fakePlaces(
  TEST_PAGE_SIZE,
  page2PlaceNames.map((name) => ({ name: { fi: name } }))
);
const page2PlacesResponse = {
  data: { places: { ...page2Places, meta } },
};
const page2PlacesVariables = { ...variables, page: 2 };
const mockedPage2PlacesResponse = {
  request: { query: PlacesDocument, variables: page2PlacesVariables },
  result: page2PlacesResponse,
};

const sortedPlaceNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted places ${n}`
);
const sortedPlaces = fakePlaces(
  TEST_PAGE_SIZE,
  sortedPlaceNames.map((name) => ({ name: { fi: name } }))
);
const sortedPlacesResponse = {
  data: { places: { ...sortedPlaces, meta } },
};
const sortedPlacesVariables = {
  ...variables,
  sort: PLACE_SORT_OPTIONS.NAME,
};
const mockedSortedPlacesResponse = {
  request: { query: PlacesDocument, variables: sortedPlacesVariables },
  result: sortedPlacesResponse,
};

export {
  mockedPage2PlacesResponse,
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  page2PlaceNames,
  placeNames,
  places,
  sortedPlaceNames,
  sortedPlacesResponse,
};
