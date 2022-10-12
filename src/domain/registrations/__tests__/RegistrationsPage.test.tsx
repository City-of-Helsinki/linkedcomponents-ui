/* eslint-disable max-len */
import { createMemoryHistory } from 'history';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
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

const mocks = [
  ...mockedEventResponses,
  mockedRegistrationsResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

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
  const pageDescription =
    'Ilmoittautumisten listaus. Selaa, suodata ja muokkaa ilmoittautumisiasi.';
  const pageKeywords =
    'ilmoittautuminen, lista, muokkaa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  render(<RegistrationsPage />);

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should render registrations page', async () => {
  render(<RegistrationsPage />, { authContextValue, mocks });

  await loadingSpinnerIsNotInDocument(10000);

  await findElement('createRegistrationButton');
  getElement('table');
});

test('should open create registration page', async () => {
  const user = userEvent.setup();
  const { history } = render(<RegistrationsPage />, {
    authContextValue,
    mocks,
  });

  await loadingSpinnerIsNotInDocument(10000);

  const createRegistrationButton = await findElement(
    'createRegistrationButton'
  );
  await act(async () => await user.click(createRegistrationButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations/create')
  );
});

it('scrolls to registration table row and calls history.replace correctly (deletes registrationId from state)', async () => {
  const route = '/fi/registrations';
  const history = createMemoryHistory();
  history.push(route, { registrationId: registrations.data[0]?.id });

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<RegistrationsPage />, {
    authContextValue,
    history,
    mocks,
    routes: [route],
  });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {}
    )
  );

  const eventRowButton = await screen.findByRole(
    'button',
    { name: eventNames[0] },
    { timeout: 20000 }
  );
  await waitFor(() => expect(eventRowButton).toHaveFocus());
});
