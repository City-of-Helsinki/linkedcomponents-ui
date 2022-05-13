import React from 'react';

import { ROUTES } from '../../../constants';
import { RegistrationDocument } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  actWait,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { REGISTRATION_INCLUDES } from '../../registration/constants';
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
    variables: {
      id: registrationId,
      include: REGISTRATION_INCLUDES,
      createPath: undefined,
    },
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
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  getElement('registrationSavedHeading');
  await actWait(100);

  const backToRegistrationsButton = getElement('backToRegistrationsButton');
  await act(async () => await user.click(backToRegistrationsButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
});

test('should route to create registration page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  getElement('registrationSavedHeading');
  await actWait(100);

  const addEventButton = getElement('addRegistrationButton');
  await act(async () => await user.click(addEventButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations/create')
  );
});
