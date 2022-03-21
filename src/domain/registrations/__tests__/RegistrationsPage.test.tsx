/* eslint-disable max-len */
import { createMemoryHistory } from 'history';
import React from 'react';

import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  eventNames,
  mockedEventResponses,
  mockedRegistrationsResponse,
  registrations,
} from '../__mocks__/registrationsPage';
import RegistrationsPage from '../RegistrationsPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();

const mocks = [
  ...mockedEventResponses,
  mockedRegistrationsResponse,
  mockedUserResponse,
];

beforeEach(() => jest.clearAllMocks());

const findElement = (key: 'createRegistrationButton') => {
  switch (key) {
    case 'createRegistrationButton':
      return screen.findByRole('button', { name: /lisää uusi/i });
  }
};

const getElement = (key: 'createRegistrationButton' | 'table') => {
  switch (key) {
    case 'createRegistrationButton':
      return screen.getByRole('button', { name: /lisää uusi/i });
    case 'table':
      return screen.getByRole('table', {
        name: /ilmoittautumiset, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
  }
};

test('should show correct title, description and keywords', async () => {
  const pageTitle = 'Ilmoittautuminen - Linked Events';

  render(<RegistrationsPage />);

  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const ogTitle = head?.querySelector('[property="og:title"]');

  expect(ogTitle).toHaveAttribute('content', pageTitle);
});

test('should render registrations page', async () => {
  const store = getMockReduxStore(storeState);
  render(<RegistrationsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  await findElement('createRegistrationButton');
  getElement('table');
});

test('should open create registration page', async () => {
  const store = getMockReduxStore(storeState);
  const { history } = render(<RegistrationsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const createRegistrationButton = await findElement(
    'createRegistrationButton'
  );
  userEvent.click(createRegistrationButton);

  expect(history.location.pathname).toBe('/fi/registrations/create');
});

it('scrolls to registration table row and calls history.replace correctly (deletes registrationId from state)', async () => {
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);
  const route = '/fi/registrations';
  const history = createMemoryHistory();
  const historyObject = {
    state: { registrationId: registrations.data[0].id },
    pathname: route,
  };
  history.push(historyObject);

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<RegistrationsPage />, {
    history,
    mocks,
    routes: [route],
    store,
  });

  await loadingSpinnerIsNotInDocument();

  expect(replaceSpy).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: historyObject.pathname })
  );

  const eventRowButton = await screen.findByRole('button', {
    name: eventNames[0],
  });
  await waitFor(() => expect(eventRowButton).toHaveFocus());
});
