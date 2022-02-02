import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedDeleteRegistrationResponse,
  mockedEventResponse,
  mockedInvalidUpdateRegistrationResponse,
  mockedRegistrationResponse,
  mockedUpdatedRegistationResponse,
  mockedUpdateRegistrationResponse,
  mockedUserResponse,
  registrationId,
} from '../__mocks__/editRegistrationPage';
import EditRegistrationPage from '../EditRegistrationPage';

configure({ defaultHidden: true });

const baseMocks = [
  mockedEventResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const route = ROUTES.EDIT_REGISTRATION.replace(':id', registrationId);

const renderComponent = (
  mocks: MockedResponse[] = baseMocks,
  renderOptions?: CustomRenderOptions
) =>
  renderWithRoute(<EditRegistrationPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_REGISTRATION,
    store,
    ...renderOptions,
  });

const openMenu = async () => {
  const toggleButton = screen
    .getAllByRole('button', { name: /valinnat/i })
    .pop();

  userEvent.click(toggleButton);
  screen.getByRole('region', { name: /valinnat/i });

  return toggleButton;
};

const getButton = (key: 'delete' | 'update') => {
  switch (key) {
    case 'delete':
      return screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'update':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
  }
};

const getInput = (key: 'enrolmentStartTime' | 'minimumAttendeeCapacity') => {
  switch (key) {
    case 'enrolmentStartTime':
      return screen.getByRole('textbox', { name: /ilmoittautuminen alkaa/i });
    case 'minimumAttendeeCapacity':
      return screen.getByRole('spinbutton', {
        name: /paikkojen vähimmäismäärä/i,
      });
  }
};

test('should move to registrations page to deleting registration', async () => {
  const mocks = [...baseMocks, mockedDeleteRegistrationResponse];
  const { history } = renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const deleteButton = getButton('delete');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  userEvent.click(deleteRegistrationButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
  expect(history.location.pathname).toBe('/fi/registrations');
});

test('should update registration', async () => {
  const mocks = [
    ...baseMocks,
    mockedUpdateRegistrationResponse,
    mockedUpdatedRegistationResponse,
  ];
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('update');
  userEvent.click(updateButton);

  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText('23.08.2021 12.00');
});

test('should scroll to first error when validation error is thrown', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const minimumAttendeeCapacityInput = getInput('minimumAttendeeCapacity');
  act(() => userEvent.clear(minimumAttendeeCapacityInput));
  userEvent.type(minimumAttendeeCapacityInput, '-1');

  const updateButton = getButton('update');
  act(() => userEvent.click(updateButton));

  await waitFor(() => expect(minimumAttendeeCapacityInput).toHaveFocus());
});

test("should show not found page if registration doesn't exist", async () => {
  renderComponent(undefined, {
    routes: [ROUTES.EDIT_REGISTRATION.replace(':id', 'not-exist')],
  });

  await screen.findByText(
    'Etsimääsi sisältöä ei löydy. Kirjaudu sisään tai palaa kotisivulle.'
  );
});

test('should show server errors', async () => {
  const mocks = [...baseMocks, mockedInvalidUpdateRegistrationResponse];
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('update');
  userEvent.click(updateButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
