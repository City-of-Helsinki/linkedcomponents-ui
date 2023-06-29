/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  configure,
  fireEvent,
  pasteToTextEditor,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
} from '../../language/__mocks__/language';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedPlaceResponse } from '../../place/__mocks__/place';
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
  mockedSendMessageResponse,
  mockedUpdateEnrolmentResponse,
  sendMessageValues,
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
  await user.click(toggleButton);
  const menu = getElement('menu');

  return { menu, toggleButton };
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedEnrolmentResponse,
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
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

  await user.clear(nameInput);
  await user.click(submitButton);

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
  await user.click(cancelButton);

  const dialog = screen.getByRole('dialog', {
    name: 'Haluatko varmasti poistaa ilmoittautumisen?',
  });

  const confirmCancelButton = within(dialog).getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(confirmCancelButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/enrolments`
    )
  );
});

test('should send message to participant', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedSendMessageResponse]);

  await findElement('nameInput');
  const { menu } = await openMenu();

  const sendMessageButton = await within(menu).findByRole('button', {
    name: 'Lähetä viesti',
  });
  await user.click(sendMessageButton);

  const withinModal = within(
    screen.getByRole('dialog', { name: 'Lähetä viesti osallistujalle' })
  );
  const subjectInput = withinModal.getByLabelText(/Otsikko/i);
  const messageInput = await withinModal.findByLabelText(
    /editorin muokkausalue: main/i
  );
  fireEvent.change(subjectInput, {
    target: { value: sendMessageValues.subject },
  });
  pasteToTextEditor(messageInput, sendMessageValues.body);

  const confirmSendMessageButton = withinModal.getByRole('button', {
    name: 'Lähetä viesti',
  });
  await user.click(confirmSendMessageButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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
  await user.click(submitButton);

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  const mocks = [...defaultMocks, mockedInvalidUpdateEnrolmentResponse];
  renderComponent(mocks);

  await findElement('nameInput');

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
