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
import { mockedRegistrationUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeleteSignupResponse,
  mockedInvalidUpdateSignupResponse,
  mockedSendMessageResponse,
  mockedSignupResponse,
  mockedUpdateSignupResponse,
  sendMessageValues,
  signup,
  signupId,
} from '../__mocks__/editSignupPage';
import EditSignupPage from '../EditSignupPage';

configure({ defaultHidden: true });

const findElement = (key: 'cancelButton' | 'firstNameInput') => {
  switch (key) {
    case 'cancelButton':
      return screen.findByRole('button', { name: 'Peruuta osallistuminen' });
    case 'firstNameInput':
      return screen.findByLabelText(/etunimi/i);
  }
};

const getElement = (
  key:
    | 'cityInput'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'firstNameInput'
    | 'lastNameInput'
    | 'menu'
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
    case 'firstNameInput':
      return screen.getByLabelText(/etunimi/i);
    case 'lastNameInput':
      return screen.getByLabelText(/sukunimi/i);
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
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
  mockedSignupResponse,
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
  mockedRegistrationResponse,
  mockedRegistrationUserResponse,
];

const route = ROUTES.EDIT_SIGNUP.replace(
  ':registrationId',
  registrationId
).replace(':signupId', signupId);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditSignupPage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.EDIT_SIGNUP,
  });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const firstNameInput = await findElement('firstNameInput');
  const submitButton = getElement('submitButton');

  await user.clear(firstNameInput);
  await user.click(submitButton);

  await waitFor(() => expect(firstNameInput).toHaveFocus());
});

test('should initialize input fields', async () => {
  renderComponent();

  const firstNameInput = await findElement('firstNameInput');
  const lastNameInput = await getElement('lastNameInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');

  await waitFor(() => expect(firstNameInput).toHaveValue(signup.firstName));
  expect(lastNameInput).toHaveValue(signup.lastName);
  expect(cityInput).toHaveValue(signup.city);
  expect(emailInput).toHaveValue(signup.email);
  expect(phoneInput).toHaveValue(signup.phoneNumber);
  expect(emailCheckbox).toBeChecked();
});

test('should delete signup', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteSignupResponse,
  ]);

  await findElement('firstNameInput');
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
      `/fi/registrations/${registrationId}/signups`
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

  await findElement('firstNameInput');
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

test('should update signup', async () => {
  global.scrollTo = jest.fn();
  const user = userEvent.setup();
  renderComponent([
    ...defaultMocks,
    mockedUpdateSignupResponse,
    mockedSignupResponse,
  ]);

  await findElement('firstNameInput');

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  const mocks = [...defaultMocks, mockedInvalidUpdateSignupResponse];
  renderComponent(mocks);

  await findElement('firstNameInput');

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('signup group extra info field should not be visible', async () => {
  renderComponent();

  await findElement('firstNameInput');
  expect(
    screen.queryByRole('textbox', {
      name: 'Lisätietoa ilmoittautumisesta (valinnainen)',
    })
  ).not.toBeInTheDocument();
});
