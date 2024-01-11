/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
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
import { mockedSignupGroupResponse } from '../../signupGroup/__mocks__/editSignupGroupPage';
import {
  findFirstNameInputs,
  getSignupFormElement,
  tryToCancel,
  tryToUpdate,
} from '../../signupGroup/__tests__/testUtils';
import { mockedRegistrationUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeleteSignupResponse,
  mockedInvalidUpdateSignupResponse,
  mockedSendMessageResponse,
  mockedSignupResponse,
  mockedSignupWithGroupResponse,
  mockedUpdateSignupResponse,
  sendMessageValues,
  signup,
  signupId,
} from '../__mocks__/editSignupPage';
import EditSignupPage from '../EditSignupPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getSignupFormElement('toggle');
  await user.click(toggleButton);
  const menu = getSignupFormElement('menu');

  return { menu, toggleButton };
};

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
    mocks,
    routes: [route],
    path: ROUTES.EDIT_SIGNUP,
  });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const firstNameInput = (await findFirstNameInputs())[0];
  const submitButton = getSignupFormElement('submitButton');

  await user.clear(firstNameInput);
  await user.click(submitButton);

  await waitFor(() => expect(firstNameInput).toHaveFocus());
});

test('should initialize input fields', async () => {
  renderComponent();

  const firstNameInput = (await findFirstNameInputs())[0];
  const lastNameInput = getSignupFormElement('lastNameInput');
  const cityInput = getSignupFormElement('cityInput');
  const emailInput = getSignupFormElement('emailInput');
  const contactPersonPhoneInput = getSignupFormElement(
    'contactPersonPhoneInput'
  );
  const emailCheckbox = getSignupFormElement('emailCheckbox');

  await waitFor(() => expect(firstNameInput).toHaveValue(signup.firstName));
  expect(lastNameInput).toHaveValue(signup.lastName);
  expect(cityInput).toHaveValue(signup.city);
  expect(emailInput).toHaveValue(signup.contactPerson?.email);
  expect(contactPersonPhoneInput).toHaveValue(
    signup.contactPerson?.phoneNumber
  );
  expect(emailCheckbox).toBeChecked();
});

test('contact person fields should be disabled if signup has a signup group', async () => {
  renderComponent([
    mockedSignupGroupResponse,
    mockedSignupWithGroupResponse,
    mockedLanguagesResponse,
    mockedServiceLanguagesResponse,
    mockedOrganizationAncestorsResponse,
    mockedPlaceResponse,
    mockedRegistrationResponse,
    mockedRegistrationUserResponse,
  ]);

  const firstNameInput = (await findFirstNameInputs())[1];
  const emailInput = getSignupFormElement('emailInput');
  const contactPersonPhoneInput = getSignupFormElement(
    'contactPersonPhoneInput'
  );
  const lastNameInput = screen.getAllByLabelText(/sukunimi/i)[1];
  const membershipNumberInput = getSignupFormElement('membershipNumberInput');
  const nativeLanguageButton = getSignupFormElement('nativeLanguageButton');
  const serviceLanguageButton = getSignupFormElement('serviceLanguageButton');

  expect(
    screen.getByRole('heading', {
      name: /yhteyshenkilön tietoja ei voi muokata/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Osallistujaryhmän yhteyshenkilön tietoja ei voi muokata tältä sivulta. Yhteystietoja voi muokata osallistujaryhmän muokkaussivulta.'
    )
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /muokkaa osallistuharyhmää/i })
  ).toBeInTheDocument();

  expect(emailInput).toBeDisabled();
  expect(contactPersonPhoneInput).toBeDisabled();
  expect(firstNameInput).toBeDisabled();
  expect(lastNameInput).toBeDisabled();
  expect(membershipNumberInput).toBeDisabled();
  expect(nativeLanguageButton).toBeDisabled();
  expect(serviceLanguageButton).toBeDisabled();
});

test('should delete signup', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteSignupResponse,
  ]);

  await findFirstNameInputs();
  await tryToCancel();

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/signups`
    )
  );
});

test('should send message to participant', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedSendMessageResponse]);

  await findFirstNameInputs();
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
  global.scrollTo = vi.fn<any>();
  renderComponent([
    ...defaultMocks,
    mockedUpdateSignupResponse,
    mockedSignupResponse,
  ]);

  await findFirstNameInputs();
  await tryToUpdate();

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const mocks = [...defaultMocks, mockedInvalidUpdateSignupResponse];
  renderComponent(mocks);

  await findFirstNameInputs();
  await tryToUpdate();

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('signup group extra info field should not be visible', async () => {
  renderComponent();

  await findFirstNameInputs();
  expect(
    screen.queryByRole('textbox', {
      name: 'Lisätietoa ilmoittautumisesta (valinnainen)',
    })
  ).not.toBeInTheDocument();
});
