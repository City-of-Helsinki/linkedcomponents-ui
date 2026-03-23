import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  shouldFilterEventsOrRegistrations,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../organizations/__mocks__/organizationsPage';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (
  key:
    | 'eventStatusSelectorButton'
    | 'eventTypeSelectorButton'
    | 'publisherSelectorButton'
    | 'searchInput'
) => {
  switch (key) {
    case 'eventStatusSelectorButton':
      return screen.getByRole('button', { name: 'Tapahtuman tila' });
    case 'eventTypeSelectorButton':
      return screen.getByRole('button', { name: 'Tyyppi' });
    case 'publisherSelectorButton':
      return screen.getByRole('button', { name: 'Etsi julkaisijaa' });
    case 'searchInput':
      return screen.getByRole('textbox', {
        name: 'Hae Linked Events -rajapinnasta',
      });
  }
};

const mocks = [mockedOrganizationsResponse];

const renderComponent = (route: string = ROUTES.EVENTS) =>
  render(<SearchPanel />, { routes: [route], mocks });

test('should initialize search panel input', async () => {
  const user = userEvent.setup();
  const searchValue = 'search';
  renderComponent(
    `${ROUTES.SEARCH}?text=${searchValue}&type=general&eventStatus=EventCancelled`
  );

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));

  const eventTypeSelectorButton = getElement('eventTypeSelectorButton');
  within(eventTypeSelectorButton).getByText(/tapahtuma/i);

  // Test that event status is initialized correctly
  const eventStatusSelectorButton = getElement('eventStatusSelectorButton');
  await user.click(eventStatusSelectorButton);
  const eventStatusCheckbox = screen.getByLabelText('Peruutettu');
  expect(eventStatusCheckbox).toBeChecked();
});

test('should search events with correct search params', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  // Event status filtering
  const eventStatusSelectorButton = getElement('eventStatusSelectorButton');
  await user.click(eventStatusSelectorButton);
  const eventStatusCheckbox = screen.getByLabelText('Peruutettu');
  await user.click(eventStatusCheckbox);

  await shouldFilterEventsOrRegistrations({
    expectedPathname: '/fi/events',
    expectedSearch:
      '?eventStatus=EventCancelled&publisher=organization%3A1&text=search&type=general',
    history,
    searchButtonLabel: 'Etsi tapahtumia',
    searchInputLabel: 'Hae Linked Events -rajapinnasta',
    values: {
      publisher: organizations.data[0]?.name as string,
      text: 'search',
    },
  });
});
