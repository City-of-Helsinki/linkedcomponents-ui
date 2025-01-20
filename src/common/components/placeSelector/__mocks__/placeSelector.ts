import {
  addressLocality,
  placeId,
  placeName,
  streetAddress,
} from '../../../../domain/place/__mocks__/place';
import { PlaceDocument, PlacesDocument } from '../../../../generated/graphql';
import { fakePlace, fakePlaces } from '../../../../utils/mockDataUtils';

const selectedPlaceText = `${placeName} (${streetAddress}, ${addressLocality})`;

const place = fakePlace({
  id: placeId,
  addressLocality: { fi: addressLocality },
  streetAddress: { fi: streetAddress },
  name: { fi: placeName },
});

const placeVariables = { id: placeId, createPath: undefined };
const placeResponse = { data: { place } };
const mockedPlaceResponse = {
  request: { query: PlaceDocument, variables: placeVariables },
  result: placeResponse,
};

const places = fakePlaces(1, [place]);
const placesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse = {
  request: { query: PlacesDocument, variables: placesVariables },
  result: placesResponse,
};

const filteredPlaces = places;
const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: selectedPlaceText,
};
const filteredPlacesResponse = { data: { places: filteredPlaces } };
const mockedFilteredPlacesResponse = {
  request: { query: PlacesDocument, variables: filteredPlacesVariables },
  result: filteredPlacesResponse,
};

export {
  filteredPlaces,
  mockedFilteredPlacesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  place,
  placeId,
  placeName,
  selectedPlaceText,
};
