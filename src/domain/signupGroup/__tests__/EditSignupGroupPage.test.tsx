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
import {
  findFirstNameInputs,
  getSignupFormElement,
  openMenu,
  tryToCancel,
  tryToUpdate,
} from './testUtils';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

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
    mocks,
    routes: [route],
    path: ROUTES.EDIT_SIGNUP_GROUP,
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
  const phoneInput = getSignupFormElement('phoneInput');
  const emailCheckbox = getSignupFormElement('emailCheckbox');

  await waitFor(() => expect(firstNameInput).toHaveValue(signup.firstName));
  expect(lastNameInput).toHaveValue(signup.lastName);
  expect(cityInput).toHaveValue(signup.city);
  expect(emailInput).toHaveValue(signup.contactPerson?.email);
  expect(phoneInput).toHaveValue(signup.contactPerson?.phoneNumber);
  expect(emailCheckbox).toBeChecked();
});

test('should send message to signup group', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedSendMessageToSignupGroupResponse]);

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

test('should update signup group', async () => {
  global.scrollTo = vi.fn<any>();
  renderComponent([
    ...defaultMocks,
    mockedUpdateSignupGroupResponse,
    mockedSignupGroupResponse,
  ]);

  await findFirstNameInputs();
  await tryToUpdate();

  await waitFor(() => expect(global.scrollTo).toHaveBeenCalled());
});

test('should show server errors', async () => {
  const mocks = [...defaultMocks, mockedInvalidUpdateSignupGroupResponse];
  renderComponent(mocks);

  await findFirstNameInputs();
  await tryToUpdate();

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('should delete signup group', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteSignupGroupResponse,
  ]);

  await findFirstNameInputs();
  await tryToCancel();

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/signups`
    )
  );
});

test('signup group extra info field should be visible', async () => {
  renderComponent();

  await findFirstNameInputs();
  expect(getSignupFormElement('signupGroupExtraInfoField')).toBeInTheDocument();
});
