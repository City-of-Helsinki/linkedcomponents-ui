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
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  enrolmentValues,
  mockedCreateEnrolmentResponse,
  mockedInvalidCreateEnrolmentResponse,
} from '../__mocks__/createEnrolmentPage';
import CreateEnrolmentPage from '../CreateEnrolmentPage';

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
  mockedEventResponse,
  mockedLanguagesResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const route = ROUTES.CREATE_ENROLMENT.replace(
  ':registrationId',
  registrationId
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<CreateEnrolmentPage />, {
    mocks,
    routes: [route],
    path: ROUTES.CREATE_ENROLMENT,
    store,
  });

test('should validate enrolment form and focus invalid field and finally create enrolment', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateEnrolmentResponse,
  ]);

  const nameInput = await findElement('nameInput');
  const streetAddressInput = getElement('streetAddressInput');
  const yearOfBirthButton = getElement('yearOfBirthButton');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const notificationLanguageButton = getElement('notificationLanguageButton');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  const submitButton = getElement('submitButton');

  expect(nameInput).not.toHaveFocus();

  userEvent.click(submitButton);
  await waitFor(() => expect(nameInput).toHaveFocus());

  userEvent.type(nameInput, enrolmentValues.name);
  userEvent.click(submitButton);
  await waitFor(() => expect(streetAddressInput).toHaveFocus());

  userEvent.type(streetAddressInput, enrolmentValues.streetAddress);
  userEvent.click(submitButton);
  await waitFor(() => expect(yearOfBirthButton).toHaveFocus());

  userEvent.click(yearOfBirthButton);
  const yearOption = await screen.findByRole('option', { name: /1990/i });
  userEvent.click(yearOption);
  userEvent.click(submitButton);
  await waitFor(() => expect(zipInput).toHaveFocus());

  userEvent.type(zipInput, enrolmentValues.zip);
  userEvent.click(submitButton);
  await waitFor(() => expect(cityInput).toHaveFocus());

  userEvent.type(cityInput, enrolmentValues.city);
  userEvent.click(submitButton);
  await waitFor(() => expect(emailCheckbox).toHaveFocus());

  expect(emailInput).not.toBeRequired();
  userEvent.click(emailCheckbox);
  userEvent.click(submitButton);
  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();

  expect(phoneInput).not.toBeRequired();
  userEvent.type(emailInput, enrolmentValues.email);
  userEvent.click(phoneCheckbox);
  userEvent.click(submitButton);
  await waitFor(() => expect(phoneInput).toHaveFocus());
  expect(phoneInput).toBeRequired();

  userEvent.type(phoneInput, enrolmentValues.phone);
  userEvent.click(submitButton);
  await waitFor(() => expect(notificationLanguageButton).toHaveFocus());

  userEvent.click(notificationLanguageButton);
  const notificationLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(notificationLanguageOption);
  userEvent.click(submitButton);
  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  userEvent.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(nativeLanguageOption);
  userEvent.click(submitButton);
  await waitFor(() => expect(serviceLanguageButton).toHaveFocus());

  userEvent.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(serviceLanguageOption);
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidCreateEnrolmentResponse]);

  const nameInput = await findElement('nameInput');
  const streetAddressInput = getElement('streetAddressInput');
  const yearOfBirthButton = getElement('yearOfBirthButton');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const notificationLanguageButton = getElement('notificationLanguageButton');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  const submitButton = getElement('submitButton');

  userEvent.type(nameInput, enrolmentValues.name);
  userEvent.type(streetAddressInput, enrolmentValues.streetAddress);
  userEvent.click(yearOfBirthButton);
  const yearOption = await screen.findByRole('option', { name: /1990/i });
  userEvent.click(yearOption);
  userEvent.type(zipInput, enrolmentValues.zip);
  userEvent.type(cityInput, enrolmentValues.city);
  userEvent.click(emailCheckbox);
  userEvent.type(emailInput, enrolmentValues.email);
  userEvent.click(phoneCheckbox);
  userEvent.type(phoneInput, enrolmentValues.phone);
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

  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
