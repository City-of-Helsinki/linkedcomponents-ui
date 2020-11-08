import range from 'lodash/range';
import React from 'react';

import { PlaceDocument, PlacesDocument } from '../../../../generated/graphql';
import { fakePlace, fakePlaces } from '../../../../utils/mockDataUtils';
import {
  actWait,
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

const placeResponse = { data: { place } };

const placeNames = range(1, 6).map((val) => `Place name ${val}`);
const places = fakePlaces(
  placeNames.length,
  placeNames.map((name) => ({ name: { fi: name } }))
);
const placesResponse = { data: { places } };

const defaultPlacesVariables = {
  createPath: undefined,
  text: '',
};

const filteredPlacesVariables = {
  ...defaultPlacesVariables,
  text: selectedPlaceText,
};

const filteredPlaces = fakePlaces(1, [place]);
const filteredPlacesResponse = { data: { places: filteredPlaces } };

const mocks = [
  {
    request: {
      query: PlaceDocument,
      variables: { id: placeId, createPath: undefined },
    },
    result: placeResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: defaultPlacesVariables,
    },
    result: placesResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: filteredPlacesVariables,
    },
    result: filteredPlacesResponse,
  },
];

const defaultProps: PlaceSelectorProps = {
  helper,
  label,
  name,
  value: placeAtId,
};

const renderComponent = (props?: Partial<PlaceSelectorProps>) =>
  render(<PlaceSelector {...defaultProps} {...props} />, { mocks });

test('should combobox input value to be selected place option label', async () => {
  renderComponent();

  await actWait();

  const inputField = screen.queryByRole('combobox', {
    name: new RegExp(helper),
  });

  await waitFor(() => {
    expect(inputField).toHaveValue(selectedPlaceText);
  });
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  await actWait();

  const inputField = screen.queryByRole('combobox', {
    name: new RegExp(helper),
  });

  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = screen.queryByRole('button');
  userEvent.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');

  filteredPlaces.data.forEach(async (option) => {
    await waitFor(() => {
      expect(
        screen.queryByRole('option', { hidden: true, name: option.name.fi })
      ).toBeInTheDocument();
    });
  });
});
