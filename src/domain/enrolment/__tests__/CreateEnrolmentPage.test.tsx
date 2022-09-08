/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';
import React from 'react';

import { ROUTES } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
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

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const findElement = (key: 'nameInput' | 'submitButton') => {
  switch (key) {
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi/i });
    case 'submitButton':
      return screen.findByRole('button', { name: /tallenna osallistuja/i });
  }
};

const getElement = (
  key:
    | 'cityInput'
    | 'confirmDeleteModal'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'nameInput'
    | 'nativeLanguageButton'
    | 'participantAmountInput'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'updateParticipantAmountButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'cityInput':
      return screen.getByRole('textbox', { name: /kaupunki/i });
    case 'confirmDeleteModal':
      return screen.getByRole('dialog', {
        name: 'Vahvista osallistujan poistaminen',
      });
    case 'dateOfBirthInput':
      return screen.getByRole('textbox', { name: /syntymäaika/i });
    case 'emailCheckbox':
      return screen.getByRole('checkbox', { name: /sähköpostilla/i });
    case 'emailInput':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'participantAmountInput':
      return screen.getByRole('spinbutton', {
        name: /ilmoittautujien määrä \*/i,
      });

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
    case 'updateParticipantAmountButton':
      return screen.getByRole('button', { name: /päivitä/i });
    case 'zipInput':
      return screen.getByRole('textbox', { name: /postinumero/i });
  }
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedEventResponse,
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
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.CREATE_ENROLMENT,
  });

const waitLoadingAndGetNameInput = async () => {
  await loadingSpinnerIsNotInDocument();
  return await findElement('nameInput');
};

test('should validate enrolment form and focus invalid field and finally create enrolment', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateEnrolmentResponse,
  ]);

  const nameInput = await waitLoadingAndGetNameInput();
  const streetAddressInput = getElement('streetAddressInput');
  const dateOfBirthInput = getElement('dateOfBirthInput');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  const submitButton = await findElement('submitButton');

  expect(nameInput).not.toHaveFocus();

  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(nameInput).toHaveFocus());

  await act(async () => await user.type(nameInput, enrolmentValues.name));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(streetAddressInput).toHaveFocus());

  await act(
    async () =>
      await user.type(streetAddressInput, enrolmentValues.streetAddress)
  );
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(dateOfBirthInput).toHaveFocus());

  const oldAgeValue = formatDate(subYears(new Date(), 20));
  await act(async () => await user.click(dateOfBirthInput));
  await act(async () => await user.type(dateOfBirthInput, oldAgeValue));
  await waitFor(() => expect(dateOfBirthInput).toHaveValue(oldAgeValue));
  await act(async () => await user.click(submitButton));
  await screen.findByText('Yläikäraja on 18v.');

  const youngAgeValue = formatDate(subYears(new Date(), 7));
  await act(async () => await user.click(dateOfBirthInput));
  await act(async () => await user.clear(dateOfBirthInput));
  await act(async () => await user.type(dateOfBirthInput, youngAgeValue));
  await waitFor(() => expect(dateOfBirthInput).toHaveValue(youngAgeValue));
  await act(async () => await user.click(submitButton));
  await screen.findByText('Alaikäraja on 12v.');

  await act(async () => await user.click(dateOfBirthInput));
  await act(async () => await user.clear(dateOfBirthInput));
  await act(
    async () => await user.type(dateOfBirthInput, enrolmentValues.dateOfBirth)
  );
  await waitFor(() =>
    expect(dateOfBirthInput).toHaveValue(enrolmentValues.dateOfBirth)
  );
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(zipInput).toHaveFocus());

  await act(async () => await user.type(zipInput, enrolmentValues.zip));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(cityInput).toHaveFocus());

  await act(async () => await user.type(cityInput, enrolmentValues.city));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(emailCheckbox).toHaveFocus());

  expect(emailInput).not.toBeRequired();
  await act(async () => await user.click(emailCheckbox));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();

  expect(phoneInput).not.toBeRequired();
  await act(async () => await user.type(emailInput, enrolmentValues.email));
  await act(async () => await user.click(phoneCheckbox));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(phoneInput).toHaveFocus());
  expect(phoneInput).toBeRequired();

  await act(async () => await user.type(phoneInput, enrolmentValues.phone));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  await act(async () => await user.click(nativeLanguageButton));
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await act(async () => await user.click(nativeLanguageOption));
  await act(async () => await user.click(submitButton));
  await waitFor(() => expect(serviceLanguageButton).toHaveFocus());

  await act(async () => await user.click(serviceLanguageButton));
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await act(async () => await user.click(serviceLanguageOption));
  await act(async () => await user.click(submitButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateEnrolmentResponse]);

  const nameInput = await waitLoadingAndGetNameInput();
  const streetAddressInput = getElement('streetAddressInput');
  const dateOfBirthInput = getElement('dateOfBirthInput');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  const submitButton = await findElement('submitButton');

  await act(async () => await user.type(nameInput, enrolmentValues.name));
  await act(
    async () =>
      await user.type(streetAddressInput, enrolmentValues.streetAddress)
  );
  await act(async () => await user.click(dateOfBirthInput));
  await act(
    async () => await user.type(dateOfBirthInput, enrolmentValues.dateOfBirth)
  );
  await act(async () => await user.click(zipInput));
  await act(async () => await user.type(zipInput, enrolmentValues.zip));
  await act(async () => await user.type(cityInput, enrolmentValues.city));
  await act(async () => await user.click(emailCheckbox));
  await act(async () => await user.type(emailInput, enrolmentValues.email));
  await act(async () => await user.click(phoneCheckbox));
  await act(async () => await user.type(phoneInput, enrolmentValues.phone));
  await act(async () => await user.click(nativeLanguageButton));
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await act(async () => await user.click(nativeLanguageOption));
  await act(async () => await user.click(serviceLanguageButton));
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await act(async () => await user.click(serviceLanguageOption));

  await act(async () => await user.click(submitButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});

test('should add and delete participants', async () => {
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndGetNameInput();

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
    'updateParticipantAmountButton'
  );

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();

  await act(async () => await user.clear(participantAmountInput));
  await act(async () => await user.type(participantAmountInput, '2'));
  await act(async () => await user.click(updateParticipantAmountButton));

  screen.getByRole('button', { name: 'Osallistuja 2' });

  await act(async () => await user.clear(participantAmountInput));
  await act(async () => await user.type(participantAmountInput, '1'));
  await act(async () => await user.click(updateParticipantAmountButton));

  const deleteParticipantButton = within(
    getElement('confirmDeleteModal')
  ).getByRole('button', { name: 'Poista osallistuja' });
  await act(async () => await user.click(deleteParticipantButton));

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();
});

test('should show and hide participant specific fields', async () => {
  const user = userEvent.setup();

  renderComponent();

  const nameInput = await waitLoadingAndGetNameInput();
  const toggleButton = screen.getByRole('button', {
    name: 'Osallistuja 1',
  });

  await act(async () => await user.click(toggleButton));
  expect(nameInput).not.toBeInTheDocument();

  await act(async () => await user.click(toggleButton));
  getElement('nameInput');
});

test('should delete participants by clicking delete participant button', async () => {
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndGetNameInput();

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
    'updateParticipantAmountButton'
  );

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();

  await act(async () => await user.clear(participantAmountInput));
  await act(async () => await user.type(participantAmountInput, '2'));
  await act(async () => await user.click(updateParticipantAmountButton));

  screen.getByRole('button', { name: 'Osallistuja 2' });

  const deleteButton = screen.getAllByRole('button', {
    name: /poista osallistuja/i,
  })[1];
  await act(async () => await user.click(deleteButton));

  const deleteParticipantButton = within(
    getElement('confirmDeleteModal')
  ).getByRole('button', { name: 'Poista osallistuja' });
  await act(async () => await user.click(deleteParticipantButton));

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();
});
