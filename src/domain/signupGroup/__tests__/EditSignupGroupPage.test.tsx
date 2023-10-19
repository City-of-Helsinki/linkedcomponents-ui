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
  mockedDeleteSignupGroupResponse,
  mockedInvalidUpdateSignupGroupResponse,
  mockedSendMessageToSignupGroupResponse,
  mockedSignupGroupResponse,
  mockedUpdateSignupGroupResponse,
  sendMessageValues,
  signup,
  signupGroupId,
} from '../__mocks__/editSignupGroupPage';
import EditSignupGroupPage from '../EditSignupGroupPage';

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
    | 'signupGroupExtraInfoField'
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
    case 'signupGroupExtraInfoField':
      return screen.getByRole('textbox', {
        name: 'Lisätietoa ilmoittautumisesta (valinnainen)',
      });
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
  mockedSignupGroupResponse,
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
  mockedRegistrationResponse,
  mockedRegistrationUserResponse,
];

const route = ROUTES.EDIT_SIGNUP_GROUP.replace(
  ':registrationId',
  registrationId
).replace(':signupGroupId', signupGroupId);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditSignupGroupPage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.EDIT_SIGNUP_GROUP,
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

test('should send message to signup group', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedSendMessageToSignupGroupResponse]);

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

test('should update signup group', async () => {
  global.scrollTo = vi.fn<any>();
  const user = userEvent.setup();
  renderComponent([
    ...defaultMocks,
    mockedUpdateSignupGroupResponse,
    mockedSignupGroupResponse,
  ]);

  await findElement('firstNameInput');

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  const mocks = [...defaultMocks, mockedInvalidUpdateSignupGroupResponse];
  renderComponent(mocks);

  await findElement('firstNameInput');

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('should delete signup group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteSignupGroupResponse,
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

test('signup group extra info field should be visible', async () => {
  renderComponent();

  await findElement('firstNameInput');
  expect(getElement('signupGroupExtraInfoField')).toBeInTheDocument();
});
