import { clear } from 'jest-date-mock';
import React from 'react';

import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import userManager from '../../../auth/userManager';
import AuthRequiredNotification, {
  hiddenStyles,
} from '../AuthRequiredNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<AuthRequiredNotification />, renderOptions);

test('should show sign in notification is user is not signed in', () => {
  renderComponent();
});

test('should start sign in process', () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });

  userEvent.click(signInButton);
  expect(signinRedirect).toBeCalled();
});

test('should hide notification when clicking close button', async () => {
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  userEvent.click(closeButton);
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});
