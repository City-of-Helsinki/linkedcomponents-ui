import React from 'react';

import { PlaceDocument, PlacesDocument } from '../../../../generated/graphql';
import { fakePlace, fakePlaces } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import PlaceSelector, { PlaceSelectorProps } from '../PlaceSelector';

configure({ defaultHidden: true });

const streetAddress = 'Testikatu 123';
const addressLocality = 'Helsinki';
const placeId = 'hel:123';
const placeName = 'Event name';
const helper = 'Helper text';
const label = 'Select place';
const name = 'place';
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
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

const filteredPlaces = fakePlaces(1, [place]);
const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
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

const mocks = [mockedPlaceResponse, mockedFilterdPlacesRespomse];

const defaultProps: PlaceSelectorProps = {
  helper,
  label,
  name,
  value: place.atId,
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
