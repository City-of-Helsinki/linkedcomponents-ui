import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  act,
  configure,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (key: 'eventTypeSelectorButton' | 'searchInput') => {
  switch (key) {
    case 'eventTypeSelectorButton':
      return screen.getByRole('button', { name: 'Tyyppi' });
    case 'searchInput':
      return screen.getByRole('combobox', {
        name: 'Hae Linked Events -rajapinnasta',
      });
  }
};

const renderComponent = (route: string = ROUTES.EVENTS) =>
  render(<SearchPanel />, { routes: [route] });

test('should initialize search panel input', async () => {
  const searchValue = 'search';
  renderComponent(`${ROUTES.SEARCH}?text=${searchValue}&type=general`);

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));

  const eventTypeSelectorButton = getElement('eventTypeSelectorButton');
  within(eventTypeSelectorButton).getByText(/tapahtuma/i);
});

test('should search events with correct search params', async () => {
  const values = { text: 'search' };
  const user = userEvent.setup();

  const { history } = renderComponent();

  // Text filtering
  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: values.text } });
  await waitFor(() => expect(searchInput).toHaveValue(values.text));

  // Event type filtering
  const eventTypeSelectorButton = getElement('eventTypeSelectorButton');
  await act(async () => await user.click(eventTypeSelectorButton));
  const eventTypeCheckbox = screen.getByRole('checkbox', {
    name: /tapahtuma/i,
  });
  await act(async () => await user.click(eventTypeCheckbox));

  const searchButton = screen.getAllByRole('button', {
    name: /etsi tapahtumia/i,
  })[1];
  await act(async () => await user.click(searchButton));

  expect(history.location.pathname).toBe('/fi/events');
  expect(history.location.search).toBe('?text=search&type=general');
});
