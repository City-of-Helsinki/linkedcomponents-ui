import range from 'lodash/range';
import React from 'react';

import { PlaceDocument, PlacesDocument } from '../../../../generated/graphql';
import { fakePlace, fakePlaces } from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import PlaceSelector, { PlaceSelectorProps } from '../PlaceSelector';

const streetAddress = 'Testikatu 123';
const addressLocality = 'Helsinki';
const placeId = 'hel:123';
const placeAtId = `https://api.hel.fi/linkedevents/v1/place/${placeId}/`;
const placeName = 'Event name';
const helper = 'Helper text';
const label = 'Select place';
const name = 'place';
const selectedPlaceText = `${placeName} (${streetAddress}, ${addressLocality})`;

const place = fakePlace({
  id: placeId,
  atId: placeAtId,
  addressLocality: { fi: addressLocality },
  streetAddress: { fi: streetAddress },
  name: { fi: placeName },
});

const placeVariables = { id: placeId, createPath: undefined };
const placeResponse = { data: { place } };
const mockedPlaceResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

const placeNames = range(1, 6).map((val) => `Place name ${val}`);
const places = fakePlaces(
  placeNames.length,
  placeNames.map((name) => ({ name: { fi: name } }))
);
const placesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse = {
  request: {
    query: PlacesDocument,
    variables: placesVariables,
  },
  result: placesResponse,
};

const filteredPlaces = fakePlaces(1, [place]);
const filteredPlacesVariables = {
  ...placesVariables,
  text: selectedPlaceText,
};
const filteredPlacesResponse = { data: { places: filteredPlaces } };
const mockedFilterdPlacesRespomse = {
  request: {
    query: PlacesDocument,
    variables: filteredPlacesVariables,
  },
  result: filteredPlacesResponse,
};

const mocks = [
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedFilterdPlacesRespomse,
];

const defaultProps: PlaceSelectorProps = {
  helper,
  label,
  name,
  value: placeAtId,
};

const renderComponent = (props?: Partial<PlaceSelectorProps>) =>
  render(<PlaceSelector {...defaultProps} {...props} />, { mocks });

const getElement = (key: 'combobox' | 'toggleButton') => {
  switch (key) {
    case 'combobox':
      return screen.getByRole('combobox', {
        name: new RegExp(helper),
      });
    case 'toggleButton':
      return screen.getByRole('button', { name: new RegExp(label) });
  }
};

test('should combobox input value to be selected place option label', async () => {
  renderComponent();

  const combobox = getElement('combobox');

  await waitFor(() => expect(combobox).toHaveValue(selectedPlaceText));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  const combobox = getElement('combobox');

  expect(combobox.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  expect(combobox.getAttribute('aria-expanded')).toBe('true');

  for (const option of filteredPlaces.data) {
    await screen.findByRole('option', {
      hidden: true,
      name: new RegExp(option.name.fi),
    });
  }
});
