import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  shouldFilterEventsOrRegistrations,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../organizations/__mocks__/organizationsPage';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (
  key: 'eventTypeSelectorButton' | 'publisherSelectorButton' | 'searchInput'
) => {
  switch (key) {
    case 'eventTypeSelectorButton':
      return screen.getByRole('button', { name: 'Tyyppi' });
    case 'publisherSelectorButton':
      return screen.getByRole('button', { name: 'Etsi julkaisijaa' });
    case 'searchInput':
      return screen.getByRole('textbox', { name: 'Hae ilmoittautumisia' });
  }
};

const mocks = [mockedOrganizationsResponse];

const renderComponent = (route: string = ROUTES.EVENTS) =>
  render(<SearchPanel />, { routes: [route], mocks });

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
  const { history } = renderComponent();

  await shouldFilterEventsOrRegistrations({
    expectedPathname: '/fi/registrations',
    expectedSearch:
      '?eventType=general&publisher=organization%3A1&text=search&sort=-event__start_time',
    history,
    searchButtonLabel: 'Etsi',
    searchInputLabel: 'Hae ilmoittautumisia',
    values: {
      publisher: organizations.data[0]?.name as string,
      text: 'search',
    },
  });
});
