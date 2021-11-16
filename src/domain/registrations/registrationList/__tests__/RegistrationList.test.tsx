import React from 'react';

import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  eventNames,
  mockedEventResponses,
  mockedPage2EventResponses,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
  page2EventNames,
} from '../__mocks__/registrationList';
import RegistrationList from '../RegistrationList';

configure({ defaultHidden: true });

const mocks = [
  ...mockedEventResponses,
  ...mockedPage2EventResponses,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
];

const getElement = (key: 'page1' | 'page2' | 'pagination') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('button', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'pagination':
      return screen.getByRole('navigation', { name: 'Sivunavigointi' });
  }
};

const renderComponent = () => render(<RegistrationList />, { mocks });

test('should navigate between pages', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  expect(
    screen.queryByRole('button', { name: /Lajitteluperuste/i })
  ).not.toBeInTheDocument();

  // Page 1 event should be visible.
  await screen.findByRole('button', { name: eventNames[0] });

  const page2Button = getElement('page2');
  userEvent.click(page2Button);

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  await screen.findByRole('button', { name: page2EventNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  userEvent.click(page1Button);

  await waitFor(() => expect(history.location.search).toBe(''));
});
