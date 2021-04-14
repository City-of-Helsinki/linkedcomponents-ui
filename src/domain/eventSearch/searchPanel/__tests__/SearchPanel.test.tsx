import { MockedResponse } from '@apollo/react-testing';
import range from 'lodash/range';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { PlaceDocument, PlacesDocument } from '../../../../generated/graphql';
import { fakePlaces } from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import SearchPanel from '../SearchPanel';

const placeOverrides = range(1, 5).map((i) => ({
  id: `place:${i}`,
  name: `Place name ${i}`,
}));
const places = fakePlaces(
  placeOverrides.length,
  placeOverrides.map(({ id, name }) => ({ id, name: { fi: name } }))
);
const placesVariables = {
  createPath: undefined,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse: MockedResponse = {
  request: {
    query: PlacesDocument,
    variables: placesVariables,
  },
  result: placesResponse,
};

const place = places.data[0];
const placeId = place.id;
const placeVariables = {
  id: placeId,
  createPath: undefined,
};
const placeResponse = { data: { place } };
const mockedPlaceResponse: MockedResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

const mocks = [mockedPlacesResponse, mockedPlaceResponse];

const findElement = (
  key:
    | 'dateSelectorButton'
    | 'endDateInput'
    | 'eventTypeSelectorButton'
    | 'placeSelectorButton'
    | 'searchInput'
    | 'startDateInput'
) => {
  switch (key) {
    case 'dateSelectorButton':
      return screen.findByRole('button', {
        name: translations.common.dateSelector.buttonToggle,
      });
    case 'endDateInput':
      return screen.findByPlaceholderText(
        translations.common.dateSelector.placeholderEndDate
      );
    case 'eventTypeSelectorButton':
      return screen.findByRole('button', {
        name: translations.eventSearchPage.searchPanel.labelEventType,
      });

    case 'placeSelectorButton':
      return screen.findByRole('button', {
        name: translations.eventSearchPage.searchPanel.labelPlace,
      });
    case 'searchInput':
      return screen.findByRole('searchbox', {
        name: translations.eventSearchPage.searchPanel.labelSearch,
      });
    case 'startDateInput':
      return screen.findByPlaceholderText(
        translations.common.dateSelector.placeholderStartDate
      );
  }
};

const renderComponent = (route: string = ROUTES.SEARCH) =>
  render(<SearchPanel />, { mocks, routes: [route] });

test('should initialize search panel inputs', async () => {
  const searchValue = 'search';
  renderComponent(`${ROUTES.SEARCH}?text=${searchValue}`);

  const searchInput = await findElement('searchInput');
  expect(searchInput).toHaveValue(searchValue);
});

test('should search events with correct search params', async () => {
  const values = {
    endDate: '12.03.2021',
    place: placeId,
    startDate: '05.03.2021',
    text: 'search',
  };

  const { history } = renderComponent();

  // Text filtering
  const searchInput = await findElement('searchInput');
  userEvent.type(searchInput, values.text);

  // Date filtering
  const dateSelectorButton = await findElement('dateSelectorButton');
  userEvent.click(dateSelectorButton);

  const startDateInput = await findElement('startDateInput');
  userEvent.click(startDateInput);
  userEvent.type(startDateInput, values.startDate);
  await waitFor(() => {
    expect(startDateInput).toHaveValue(values.startDate);
  });

  const endDateInput = await findElement('endDateInput');
  userEvent.click(endDateInput);
  userEvent.type(endDateInput, values.endDate);
  await waitFor(() => {
    expect(endDateInput).toHaveValue(values.endDate);
  });

  // Place filtering
  const placeSelectorButton = await findElement('placeSelectorButton');
  userEvent.click(placeSelectorButton);
  const placeCheckbox = await screen.findByRole('checkbox', {
    name: placeOverrides[0].name,
  });
  userEvent.click(placeCheckbox);

  // Event type filtering
  const eventTypeSelectorButton = await findElement('eventTypeSelectorButton');
  userEvent.click(eventTypeSelectorButton);
  const eventTypeCheckbox = await screen.findByRole('checkbox', {
    name: 'Tapahtuma',
  });
  userEvent.click(eventTypeCheckbox);

  const searchButton = screen.getAllByRole('button', {
    name: translations.eventSearchPage.searchPanel.buttonSearch,
  })[1];
  userEvent.click(searchButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(
    '?place=place%3A1&text=search&type=event&end=2021-03-12&start=2021-03-05'
  );
});
