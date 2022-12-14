import { History } from 'history';
import React from 'react';

import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedEventResponses,
  mockedPage2EventResponses,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
} from '../__mocks__/registrationList';
import RegistrationList from '../RegistrationList';

let history: History;

configure({ defaultHidden: true });

const mocks = [
  ...mockedEventResponses,
  ...mockedPage2EventResponses,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
];

const getElement = (key: 'page1' | 'page2') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('link', { name: 'Sivu 2' });
  }
};

const renderComponent = () => render(<RegistrationList />, { mocks });

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  await act(() => {
    const { history: newHistory } = renderComponent();
    history = newHistory;
  });

  await loadingSpinnerIsNotInDocument();

  const page2Button = getElement('page2');
  await act(async () => await user.click(page2Button));

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  await act(async () => await user.click(page1Button));

  await waitFor(() => expect(history.location.search).toBe(''));
});
