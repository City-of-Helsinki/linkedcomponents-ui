/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
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
  enrolmentValues,
  mockedEnrolmentResponse,
  mockedInvalidUpdateEnrolmentResponse,
  mockedUpdateEnrolmentResponse,
} from '../__mocks__/editEnrolmentPage';
import EditEnrolmentPage from '../EditEnrolmentPage';

configure({ defaultHidden: true });

const findElement = (key: 'nameInput') => {
  switch (key) {
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi/i });
  }
};

const getElement = (
  key:
    | 'cityInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'nameInput'
    | 'nativeLanguageButton'
    | 'notificationLanguageButton'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'yearOfBirthButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'cityInput':
      return screen.getByRole('textbox', { name: /kaupunki/i });
    case 'emailCheckbox':
      return screen.getByRole('checkbox', { name: /sähköpostilla/i });
    case 'emailInput':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'notificationLanguageButton':
      return screen.getByRole('button', { name: /ilmoitusten kieli/i });
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
    case 'yearOfBirthButton':
      return screen.getByRole('button', { name: /syntymävuosi/i });
    case 'zipInput':
      return screen.getByRole('textbox', { name: /postinumero/i });
  }
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

const enterRequiredInfo = async () => {
  const streetAddressInput = getElement('streetAddressInput');
  const zipInput = getElement('zipInput');
  const yearOfBirthButton = getElement('yearOfBirthButton');
  const notificationLanguageButton = getElement('notificationLanguageButton');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');

  userEvent.type(streetAddressInput, enrolmentValues.streetAddress);
  userEvent.click(yearOfBirthButton);
  const yearOption = await screen.findByRole('option', { name: /1990/i });
  userEvent.click(yearOption);
  userEvent.type(zipInput, enrolmentValues.zip);
  userEvent.click(notificationLanguageButton);
  const notificationLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(notificationLanguageOption);
  userEvent.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(nativeLanguageOption);
  userEvent.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(serviceLanguageOption);
};

test('should scroll to first validation error input field', async () => {
  renderComponent();

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const submitButton = getElement('submitButton');
  userEvent.click(submitButton);

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

test('should update enrolment', async () => {
  global.scrollTo = jest.fn();

  renderComponent([
    ...defaultMocks,
    mockedUpdateEnrolmentResponse,
    mockedEnrolmentResponse,
  ]);

  await findElement('nameInput');
  await enterRequiredInfo();

  const submitButton = getElement('submitButton');
  userEvent.click(submitButton);

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const mocks = [...defaultMocks, mockedInvalidUpdateEnrolmentResponse];
  renderComponent(mocks);

  await findElement('nameInput');
  await enterRequiredInfo();

  const submitButton = getElement('submitButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
