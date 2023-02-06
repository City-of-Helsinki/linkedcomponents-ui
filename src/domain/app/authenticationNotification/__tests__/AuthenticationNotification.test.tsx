import React from 'react';

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
  label: "You don't have permission to edit this content",
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<AuthenticationNotification {...props} />, renderOptions);

test('should start sign in process', async () => {
  const user = userEvent.setup();

  const signIn = jest.fn();
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
