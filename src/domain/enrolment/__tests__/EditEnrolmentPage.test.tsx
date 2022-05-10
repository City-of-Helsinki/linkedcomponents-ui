/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { mockedEventResponse } from '../../event/__mocks__/event';
import { mockedLanguagesResponse } from '../../language/__mocks__/language';
import {
  mockedRegistrationResponse,
  registrationId,
} from '../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  enrolment,
  enrolmentId,
  mockedCancelEnrolmentResponse,
  mockedEnrolmentResponse,
  mockedInvalidUpdateEnrolmentResponse,
  mockedUpdateEnrolmentResponse,
} from '../__mocks__/editEnrolmentPage';
import EditEnrolmentPage from '../EditEnrolmentPage';

configure({ defaultHidden: true });

const findElement = (key: 'cancelButton' | 'nameInput') => {
  switch (key) {
    case 'cancelButton':
      return screen.findByRole('button', { name: 'Peruuta osallistuminen' });
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi/i });
  }
};

const getElement = (
  key:
    | 'cancelButton'
    | 'cityInput'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'menu'
    | 'nameInput'
    | 'nativeLanguageButton'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'toggle'
    | 'zipInput'
) => {
  switch (key) {
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'cityInput':
      return screen.getByRole('textbox', { name: /kaupunki/i });
    case 'dateOfBirthInput':
      return screen.getByRole('textbox', { name: /syntymäaika/i });
    case 'emailCheckbox':
      return screen.getByRole('checkbox', { name: /sähköpostilla/i });
    case 'emailInput':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'phoneCheckbox':
      return screen.getByRole('checkbox', { name: /tekstiviestillä/i });
    case 'phoneInput':
      return screen.getByRole('textbox', { name: /puhelinnumero/i });
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByRole('textbox', { name: /katuosoite/i });
    case 'submitButton':
      return screen.getByRole('button', { name: /tallenna osallistuja/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'zipInput':
      return screen.getByRole('textbox', { name: /postinumero/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);
const defaultMocks = [
  mockedEnrolmentResponse,
  mockedEventResponse,
  mockedEventResponse,
  mockedLanguagesResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
  ':registrationId',
  registrationId
).replace(':enrolmentId', enrolmentId);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditEnrolmentPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_REGISTRATION_ENROLMENT,
    store,
  });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  await act(async () => await user.clear(nameInput));
  const submitButton = getElement('submitButton');
  await act(async () => await user.click(submitButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should initialize input fields', async () => {
  renderComponent();

  const nameInput = await findElement('nameInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');

  await waitFor(() => expect(nameInput).toHaveValue(enrolment.name));
  expect(cityInput).toHaveValue(enrolment.city);
  expect(emailInput).toHaveValue(enrolment.email);
  expect(phoneInput).toHaveValue(enrolment.phoneNumber);
  expect(emailCheckbox).toBeChecked();
  expect(phoneCheckbox).toBeChecked();
});

test('should cancel enrolment', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCancelEnrolmentResponse,
  ]);

  await findElement('nameInput');
  await openMenu();

  const cancelButton = await findElement('cancelButton');
  await act(async () => await user.click(cancelButton));

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await act(async () => await user.click(cancelEventButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/enrolments`
    )
  );
});

test('should update enrolment', async () => {
  global.scrollTo = jest.fn();
  const user = userEvent.setup();
  renderComponent([
    ...defaultMocks,
    mockedUpdateEnrolmentResponse,
    mockedEnrolmentResponse,
  ]);

  await findElement('nameInput');

  const submitButton = getElement('submitButton');
  await act(async () => await user.click(submitButton));

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  const mocks = [...defaultMocks, mockedInvalidUpdateEnrolmentResponse];
  renderComponent(mocks);

  await findElement('nameInput');

  const submitButton = getElement('submitButton');
  await act(async () => await user.click(submitButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
