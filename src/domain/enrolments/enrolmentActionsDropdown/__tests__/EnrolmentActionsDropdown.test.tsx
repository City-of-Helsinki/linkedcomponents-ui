import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { toast } from 'react-toastify';

import { ROUTES } from '../../../../constants';
import getValue from '../../../../utils/getValue';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  fireEvent,
  pasteToTextEditor,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { EnrolmentPageProvider } from '../../../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { registration } from '../../../registration/__mocks__/registration';
import {
  mockedCancelSignupResponse,
  mockedSendMessageResponse,
  sendMessageValues,
  signup,
  signupWithGroup,
} from '../../../signup/__mocks__/editSignupPage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EnrolmentActionsDropdown, {
  EnrolmentActionsDropdownProps,
} from '../EnrolmentActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: EnrolmentActionsDropdownProps = {
  enrolment: signup,
  registration,
};

const defaultMocks = [
  mockedCancelSignupResponse,
  mockedEventResponse,
  mockedSendMessageResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const route = `/fi${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  getValue(registration.id, '')
)}`;

const renderComponent = ({
  authContextValue,
  mocks = defaultMocks,
  props,
}: {
  authContextValue?: AuthContextProps;
  mocks?: MockedResponse[];
  props?: Partial<EnrolmentActionsDropdownProps>;
} = {}) =>
  render(
    <EnrolmentPageProvider>
      <EnrolmentActionsDropdown {...defaultProps} {...props} />
    </EnrolmentPageProvider>,
    {
      authContextValue,
      mocks,
      routes: [route],
    }
  );

const getElement = (
  key: 'cancel' | 'edit' | 'menu' | 'sendMessage' | 'toggle'
) => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa tietoja' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'sendMessage':
      return screen.getByRole('button', { name: 'Lähetä viesti' });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({ authContextValue });

  const toggleButton = await openMenu();
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent({ authContextValue });

  await openMenu();

  const enabledButtons = [getElement('cancel'), getElement('edit')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test("should show toast message when clicking edit button and signup doesn't have a group", async () => {
  toast.error = jest.fn();
  const user = userEvent.setup();
  renderComponent({ props: { enrolment: signup } });

  await openMenu();

  const editButton = getElement('edit');
  await user.click(editButton);

  expect(toast.error).toBeCalledWith(
    'TODO: Editing a single signup is not supported yet'
  );
});

test('should route to edit signup group page when clicking edit button and signup has a group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { enrolment: signupWithGroup },
  });

  await openMenu();

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
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent({ authContextValue });

  await openMenu();

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

test('should try to cancel enrolment when clicking cancel button', async () => {
  const user = userEvent.setup();
  renderComponent({ authContextValue });

  await openMenu();

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
