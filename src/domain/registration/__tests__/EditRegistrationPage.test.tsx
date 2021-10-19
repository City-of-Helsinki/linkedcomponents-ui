import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { toast } from 'react-toastify';

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
} from '../../../utils/testUtils';
import {
  mockedUserResponse,
  registrationId,
} from '../__mocks__/editRegistrationPage';
import EditRegistrationPage from '../EditRegistrationPage';

configure({ defaultHidden: true });

const baseMocks = [mockedUserResponse];

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

const getInput = (key: 'enrolmentStartTime') => {
  switch (key) {
    case 'enrolmentStartTime':
      return screen.getByRole('textbox', { name: /ilmoittautuminen alkaa/i });
  }
};

test('should show toast message when trying to delete registration', async () => {
  toast.error = jest.fn();
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const deleteButton = getButton('delete');
  act(() => userEvent.click(deleteButton));

  expect(toast.error).toBeCalledWith('TODO: Delete registration');
});

test('should show toast message when trying to update registration', async () => {
  toast.error = jest.fn();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('update');
  userEvent.click(updateButton);

  await waitFor(() => {
    expect(toast.error).toBeCalledWith(
      'TODO: Update registration when API is available'
    );
  });
});

test('should scroll to first error when validation error is thrown', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const enrolmentStartTimeInput = getInput('enrolmentStartTime');
  act(() => userEvent.clear(enrolmentStartTimeInput));

  const updateButton = getButton('update');
  act(() => userEvent.click(updateButton));

  await waitFor(() => expect(enrolmentStartTimeInput).toHaveFocus());
});

test("should show not found page if registration doesn't exist", async () => {
  renderComponent(undefined, {
    routes: [ROUTES.EDIT_REGISTRATION.replace(':id', 'not-exist')],
  });

  await screen.findByText(
    'Etsimääsi sisältöä ei löydy. Kirjaudu sisään tai palaa kotisivulle.'
  );
});
