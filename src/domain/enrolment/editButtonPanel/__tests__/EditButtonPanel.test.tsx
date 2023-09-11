import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { signup } from '../../../signup/__mocks__/signup';
import { SignupPageProvider } from '../../../signup/signupPageContext/SignupPageContext';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const defaultProps: EditButtonPanelProps = {
  onCancel: jest.fn(),
  onSave: jest.fn(),
  onSendMessage: jest.fn(),
  registration,
  saving: false,
  signup,
};

const mocks = [
  mockedEventResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultRoute = `/fi/${ROUTES.EDIT_SIGNUP_GROUP.replace(
  ':registrationId',
  registrationId
).replace(':signupId', signup.id)}`;

const renderComponent = ({
  props,
  route = defaultRoute,
}: {
  props?: Partial<EditButtonPanelProps>;
  route?: string;
} = {}) =>
  render(
    <SignupPageProvider>
      <EditButtonPanel {...defaultProps} {...props} />
    </SignupPageProvider>,
    {
      authContextValue,
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
  key: 'backButton' | 'cancelButton' | 'menu' | 'saveButton' | 'toggleButton'
) => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna osallistuja' });
    case 'toggleButton':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = await openMenu();
  await user.click(toggleButton);

  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should call onCancel clicking cancel button', async () => {
  const onCancel = jest.fn();
  const user = userEvent.setup();
  renderComponent({ props: { onCancel } });

  await openMenu();
  const cancelButton = await findElement('cancelButton');
  await user.click(cancelButton);
  expect(onCancel).toBeCalled();
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

test('should call onSave', async () => {
  const onSave = jest.fn();
  const user = userEvent.setup();
  renderComponent({ props: { onSave } });

  const saveButton = getElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onSave).toBeCalled();
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent();

  getElement('toggleButton');
});
