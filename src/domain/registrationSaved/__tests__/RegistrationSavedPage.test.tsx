import React from 'react';

import { ROUTES } from '../../../constants';
import { RegistrationDocument } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import RegistrationSavedPage from '../RegistrationSavedPage';

configure({ defaultHidden: true });

const registrationId = '1';
const route = ROUTES.REGISTRATION_SAVED.replace(':id', registrationId);

const registration = fakeRegistration({ id: registrationId });
const registrationResponse = { data: { registration } };
const mockedRegistrationResponse = {
  request: {
    query: RegistrationDocument,
    variables: { id: registrationId, createPath: undefined },
  },
  result: registrationResponse,
};

const mocks = [mockedRegistrationResponse, mockedUserResponse];
const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const getElement = (
  key:
    | 'addRegistrationButton'
    | 'backToRegistrationsButton'
    | 'registrationSavedHeading'
) => {
  switch (key) {
    case 'addRegistrationButton':
      return screen.getByRole('button', {
        name: /Lisää uusi/i,
      });
    case 'backToRegistrationsButton':
      return screen.getByRole('button', {
        name: /Palaa ilmoittautumisiin/i,
      });
    case 'registrationSavedHeading':
      return screen.getByRole('heading', {
        name: /Ilmoittautuminen tallennettu onnistuneesti/i,
      });
  }
};

const renderComponent = () =>
  renderWithRoute(<RegistrationSavedPage />, {
    mocks,
    routes: [route],
    path: ROUTES.REGISTRATION_SAVED,
    store,
  });

test('should render all components', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  getElement('registrationSavedHeading');
  getElement('backToRegistrationsButton');
  getElement('addRegistrationButton');
});

test('should route to registration list page', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  getElement('registrationSavedHeading');

  const backToRegistrationsButton = getElement('backToRegistrationsButton');
  userEvent.click(backToRegistrationsButton);

  expect(history.location.pathname).toBe('/fi/registrations');
});

test('should route to create registration page', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  getElement('registrationSavedHeading');

  const addEventButton = getElement('addRegistrationButton');
  userEvent.click(addEventButton);

  expect(history.location.pathname).toBe('/fi/registrations/create');
});
