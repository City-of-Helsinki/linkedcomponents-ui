import React from 'react';

import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  openDropdownMenu,
  render,
  screen,
  shouldToggleDropdownMenu,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { SignupGroupFormProvider } from '../../../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import { signup } from '../../__mocks__/signup';
import EditSignupButtonPanel, {
  EditSignupButtonPanelProps,
} from '../EditSignupButtonPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: EditSignupButtonPanelProps = {
  onDelete: vi.fn(),
  onSendMessage: vi.fn(),
  onUpdate: vi.fn(),
  registration,
  saving: false,
  signup,
};

const mocks = [
  mockedEventResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const defaultRoute = `/fi/${ROUTES.EDIT_SIGNUP_GROUP.replace(
  ':registrationId',
  registrationId
).replace(':signupId', signup.id)}`;

const renderComponent = ({
  props,
  route = defaultRoute,
}: {
  props?: Partial<EditSignupButtonPanelProps>;
  route?: string;
} = {}) =>
  render(
    <SignupGroupFormProvider registration={registration}>
      <EditSignupButtonPanel {...defaultProps} {...props} />
    </SignupGroupFormProvider>,
    {
      mocks,
      routes: [route],
    }
  );

const findElement = (key: 'cancelButton') => {
  switch (key) {
    case 'cancelButton':
      return screen.findByRole('button', { name: 'Peruuta osallistuminen' });
  }
};

const getElement = (
  key: 'backButton' | 'cancelButton' | 'saveButton' | 'toggleButton'
) => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna osallistuja' });
    case 'toggleButton':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should call onDelete clicking cancel button', async () => {
  const onDelete = vi.fn();
  const user = userEvent.setup();
  renderComponent({ props: { onDelete } });

  await openDropdownMenu();
  const cancelButton = await findElement('cancelButton');
  await user.click(cancelButton);
  expect(onDelete).toBeCalled();
});

test('should route to signups page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/signups`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    route: `/fi${ROUTES.EDIT_SIGNUP_GROUP.replace(
      ':registrationId',
      registrationId
    )}?returnPath=${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`,
  });

  await user.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registrationId}`
    )
  );
});

test('should call onUpdate', async () => {
  const onUpdate = vi.fn();
  const user = userEvent.setup();
  renderComponent({ props: { onUpdate } });

  const saveButton = getElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onUpdate).toBeCalled();
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent();

  getElement('toggleButton');
});
