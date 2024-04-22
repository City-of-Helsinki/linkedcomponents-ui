import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedPlaceResponse,
  mockedPlacesResponse,
  placeId,
  placeName,
} from '../../__mocks__/eventSearchPage';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const mocks = [mockedPlacesResponse, mockedPlaceResponse];

const getElement = (
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
      return screen.getByRole('button', { name: 'Valitse päivämäärät' });
    case 'endDateInput':
      return screen.getByPlaceholderText('Loppuu p.k.vvvv');
    case 'eventTypeSelectorButton':
      return screen.getByRole('button', { name: 'Tyyppi' });
    case 'placeSelectorButton':
      return screen.getByRole('button', { name: 'Etsi tapahtumapaikkaa' });
    case 'searchInput':
      return screen.getByRole('textbox', {
        name: 'Hae Linked Events -rajapinnasta',
      });
    case 'startDateInput':
      return screen.getByPlaceholderText('Alkaa p.k.vvvv');
  }
};

const renderComponent = (route: string = ROUTES.SEARCH) =>
  render(<SearchPanel />, { mocks, routes: [route] });

test('should initialize search panel inputs', async () => {
  const searchValue = 'search';
  renderComponent(`${ROUTES.SEARCH}?text=${searchValue}`);

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));
});

test('should search events with correct search params', async () => {
  const values = {
    endDate: '12.3.2021',
    place: placeId,
    startDate: '5.3.2021',
    text: 'search',
  };

  const user = userEvent.setup();
  const { history } = renderComponent();

  // Text filtering
  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: values.text } });

  // Date filtering
  const dateSelectorButton = getElement('dateSelectorButton');
  await user.click(dateSelectorButton);

  const startDateInput = getElement('startDateInput');
  await user.type(startDateInput, values.startDate);
  await waitFor(() => expect(startDateInput).toHaveValue(values.startDate));

  const endDateInput = getElement('endDateInput');
  await user.type(endDateInput, values.endDate);
  await waitFor(() => expect(endDateInput).toHaveValue(values.endDate));

  // Place filtering
  const placeSelectorButton = getElement('placeSelectorButton');
  await user.click(placeSelectorButton);
  const placeCheckbox = screen.getByLabelText(placeName);
  await user.click(placeCheckbox);

  // Event type filtering
  const eventTypeSelectorButton = getElement('eventTypeSelectorButton');
  await user.click(eventTypeSelectorButton);
  const eventTypeCheckbox = await screen.findByLabelText('Tapahtuma');
  await user.click(eventTypeCheckbox);

  const searchButton = screen.getAllByRole('button', {
    name: 'Etsi tapahtumia',
  })[1];
  await user.click(searchButton);
  await waitFor(() => expect(history.location.pathname).toBe('/fi/search'));
  expect(history.location.search).toBe(
    '?place=place%3A1&text=search&type=general&end=2021-03-12&start=2021-03-05'
  );
});
