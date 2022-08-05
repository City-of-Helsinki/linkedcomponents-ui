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
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeleteRegistrationResponse,
  mockedEventResponse,
  mockedInvalidUpdateRegistrationResponse,
  mockedRegistrationResponse,
  mockedUpdatedRegistationResponse,
  mockedUpdateRegistrationResponse,
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
  const user = userEvent.setup();
  const toggleButton = screen
    .getAllByRole('button', { name: /valinnat/i })
    .pop() as HTMLElement;

  await act(async () => await user.click(toggleButton));
  screen.getByRole('region', { name: /valinnat/i });

  return toggleButton;
};

const getConfirmDeleteModal = () =>
  screen.getByRole('dialog', { name: 'Varmista ilmoittautumisen poistaminen' });

const queryConfirmDeleteModal = () =>
  screen.queryByRole('dialog', {
    name: 'Varmista ilmoittautumisen poistaminen',
  });

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
  const user = userEvent.setup();
  const { history } = renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const deleteButton = getButton('delete');
  await act(async () => await user.click(deleteButton));

  const withinModal = within(getConfirmDeleteModal());
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await act(async () => await user.click(deleteRegistrationButton));

  await waitFor(
    () => expect(queryConfirmDeleteModal()).not.toBeInTheDocument(),
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
  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('update');
  await act(async () => await user.click(updateButton));

  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText('23.08.2021 12.00');
});

test('should scroll to first error when validation error is thrown', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const minimumAttendeeCapacityInput = getInput('minimumAttendeeCapacity');
  await act(async () => await user.clear(minimumAttendeeCapacityInput));
  await act(async () => await user.type(minimumAttendeeCapacityInput, '-1'));

  const updateButton = getButton('update');
  await act(async () => await user.click(updateButton));

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
  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('update');
  await act(async () => await user.click(updateButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
