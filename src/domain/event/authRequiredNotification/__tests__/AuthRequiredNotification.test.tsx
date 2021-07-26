import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
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

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<AuthRequiredNotification />, { store });

test('should not show sign in notification is user is signed in', () => {
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  expect(screen.queryByRole('region')).not.toBeInTheDocument();
});

test('should show sign in notification is user is not signed in', () => {
  renderComponent();

  screen.getByRole('region');
  screen.getByRole('heading', { name: 'Kirjaudu sisään' });
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
