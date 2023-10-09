import React from 'react';
import { vi } from 'vitest';

import { fakeAuthContextValue } from '../../../../utils/mockAuthContextValue';
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

  const signIn = vi.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent({ authContextValue });

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });
  await user.click(signInButton);

  expect(signIn).toBeCalled();
});

test('should hide notification when clicking close button', async () => {
  const user = userEvent.setup();
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  await user.click(closeButton);
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});

test('should show custom message', async () => {
  render(
    <AuthenticationNotification
      {...props}
      notAuthenticatedCustomMessage={<p>Custom message</p>}
    />
  );

  expect(await screen.findByText(/custom message/i)).toBeInTheDocument();
});
