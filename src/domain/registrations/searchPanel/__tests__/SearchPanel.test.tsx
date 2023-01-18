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
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (key: 'eventTypeSelectorButton' | 'searchInput') => {
  switch (key) {
    case 'eventTypeSelectorButton':
      return screen.getByRole('button', { name: 'Tyyppi' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae ilmoittautumisia' });
  }
};

const renderComponent = (route: string = ROUTES.EVENTS) =>
  render(<SearchPanel />, { routes: [route] });

test('should initialize search panel input', async () => {
  const searchValue = 'search';
  renderComponent(
    `${ROUTES.REGISTRATIONS}?text=${searchValue}&eventType=general`
  );

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));
  screen.getByText(/tapahtuma/i);
});

test('should search registrations with correct search params', async () => {
  const user = userEvent.setup();
  const values = { text: 'search' };

  const { history } = renderComponent();

  // Text filtering
  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: values.text } });

  // Event type filtering
  const eventTypeSelectorButton = getElement('eventTypeSelectorButton');
  await act(async () => await user.click(eventTypeSelectorButton));
  const eventTypeCheckbox = screen.getByLabelText(/tapahtuma/i);
  await act(async () => await user.click(eventTypeCheckbox));

  const searchButton = screen.getAllByRole('button', { name: /etsi/i })[1];
  await act(async () => await user.click(searchButton));

  expect(history.location.pathname).toBe('/fi/registrations');
  expect(history.location.search).toBe('?eventType=general&text=search');
});
