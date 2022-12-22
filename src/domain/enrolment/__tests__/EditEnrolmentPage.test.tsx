/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
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
      return screen.findByLabelText(/nimi/i);
  }
};

const getElement = (
  key:
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
    case 'cityInput':
      return screen.getByLabelText(/kaupunki/i);
    case 'dateOfBirthInput':
      return screen.getByLabelText(/syntymäaika/i);
    case 'emailCheckbox':
      return screen.getByLabelText(/sähköpostilla/i);
    case 'emailInput':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'nameInput':
      return screen.getByLabelText(/nimi/i);
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'phoneCheckbox':
      return screen.getByLabelText(/tekstiviestillä/i);
    case 'phoneInput':
      return screen.getByLabelText(/puhelinnumero/i);
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByLabelText(/katuosoite/i);
    case 'submitButton':
      return screen.getByRole('button', { name: /tallenna osallistuja/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'zipInput':
      return screen.getByLabelText(/postinumero/i);
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  const menu = getElement('menu');

  return { menu, toggleButton };
};

const authContextValue = fakeAuthenticatedAuthContextValue();

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
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.EDIT_REGISTRATION_ENROLMENT,
  });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  const submitButton = getElement('submitButton');

  await act(async () => await user.clear(nameInput));
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
  const { menu } = await openMenu();

  const cancelButton = await within(menu).findByRole('button', {
    name: 'Peruuta osallistuminen',
  });
  await act(async () => await user.click(cancelButton));

  const dialog = screen.getByRole('dialog', {
    name: 'Haluatko varmasti poistaa ilmoittautumisen?',
  });

  const confirmCancelButton = within(dialog).getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await act(async () => await user.click(confirmCancelButton));

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
