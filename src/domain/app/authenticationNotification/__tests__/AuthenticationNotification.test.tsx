import React from 'react';

import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import AuthenticationNotification, {
  AuthenticationNotificationProps,
  hiddenStyles,
} from '../AuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

const props: AuthenticationNotificationProps = {
  authorizationWarningLabel: 'Sinulla ei ole oikeutta muokata sisältöä',
  getAuthorizationWarning: () => ({
    editable: false,
    warning: "You don't have permission to edit this content",
  }),
  noRequiredOrganizationLabel: 'Ei riittäviäoikeuksia',
  noRequiredOrganizationText: 'Sinulla ei ole oikeutta muokata sisältöä',
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<AuthenticationNotification {...props} />, renderOptions);

test('should start sign in process', async () => {
  const user = userEvent.setup();

  const login = vi.fn();
  mockUnauthenticatedLoginState({ login });
  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });
  await user.click(signInButton);

  expect(login).toBeCalled();
});

test('should hide notification when clicking close button', async () => {
  const user = userEvent.setup();
  mockUnauthenticatedLoginState();
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  await user.click(closeButton);
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});

test('should show custom message', async () => {
  mockUnauthenticatedLoginState();
  render(
    <AuthenticationNotification
      {...props}
      notAuthenticatedCustomMessage={<p>Custom message</p>}
    />
  );

  expect(await screen.findByText(/custom message/i)).toBeInTheDocument();
});
