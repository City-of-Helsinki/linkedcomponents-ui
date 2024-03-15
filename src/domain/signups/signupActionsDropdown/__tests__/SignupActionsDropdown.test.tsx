import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../../constants';
import getValue from '../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  fireEvent,
  openDropdownMenu,
  pasteToTextEditor,
  render,
  screen,
  shouldToggleDropdownMenu,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { registration } from '../../../registration/__mocks__/registration';
import {
  mockedDeleteSignupResponse,
  mockedSendMessageResponse,
  sendMessageValues,
  signup,
  signupWithGroup,
} from '../../../signup/__mocks__/editSignupPage';
import { SignupGroupFormProvider } from '../../../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import SignupActionsDropdown, {
  SignupActionsDropdownProps,
} from '../SignupActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: SignupActionsDropdownProps = {
  registration,
  signup,
};

const defaultMocks = [
  mockedDeleteSignupResponse,
  mockedEventResponse,
  mockedSendMessageResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const route = `/fi${ROUTES.REGISTRATION_SIGNUPS.replace(
  ':registrationId',
  getValue(registration.id, '')
)}`;

const renderComponent = ({
  mocks = defaultMocks,
  props,
}: {
  mocks?: MockedResponse[];
  props?: Partial<SignupActionsDropdownProps>;
} = {}) =>
  render(
    <SignupGroupFormProvider registration={registration}>
      <SignupActionsDropdown {...defaultProps} {...props} />
    </SignupGroupFormProvider>,
    {
      mocks,
      routes: [route],
    }
  );

const getElement = (key: 'cancel' | 'edit' | 'sendMessage') => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa tietoja' });
    case 'sendMessage':
      return screen.getByRole('button', { name: 'Lähetä viesti' });
  }
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openDropdownMenu();

  const enabledButtons = [getElement('cancel'), getElement('edit')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test("should route to edit signup page when clicking edit button and signup doesn't have a group", async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ props: { signup } });

  await openDropdownMenu();

  const editButton = getElement('edit');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signup/edit/${signup.id}`
    )
  );
});

test('should route to edit signup group page when clicking edit button and signup has a group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { signup: signupWithGroup },
  });

  await openDropdownMenu();

  const editButton = getElement('edit');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signup-group/edit/${signupWithGroup.signupGroup}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should send message to participant when clicking send message button', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const sendMessageButton = getElement('sendMessage');
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

test('should try to cancel signup when clicking cancel button', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const cancelButton = getElement('cancel');
  await user.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
