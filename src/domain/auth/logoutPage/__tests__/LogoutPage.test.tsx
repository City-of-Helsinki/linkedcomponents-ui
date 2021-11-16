import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { testId as loadingSpinnerTestId } from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { StoreState } from '../../../../types';
import {
  fakeAuthenticatedStoreState,
  fakeAuthenticationState,
  fakeOidcState,
  fakeStoreState,
} from '../../../../utils/mockStoreUtils';
import {
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import userManager from '../../userManager';
import LogoutPage from '../LogoutPage';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<LogoutPage />, { routes: ['/fi/events'], store });

test('should render logout page', () => {
  renderComponent();

  expect(screen.getByText(translations.logoutPage.text)).toBeInTheDocument();

  const buttons = [
    translations.common.signIn,
    translations.logoutPage.buttonBackToHome,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });
});

test('should route to home page', () => {
  const { history } = renderComponent();

  userEvent.click(
    screen.getByRole('button', {
      name: translations.logoutPage.buttonBackToHome,
    })
  );

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
  renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.signIn })
  );

  expect(signinRedirect).toBeCalled();
});

test('should redirect to home page when user is authenticated', () => {
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  const { history } = renderComponent(store);

  expect(history.location.pathname).toBe('/fi/');
});

test('should render loading spinner when loading authenticion state', () => {
  const state = fakeStoreState({
    authentication: fakeAuthenticationState({
      oidc: fakeOidcState({ user: null, isLoadingUser: true }),
    }),
  });
  const store = getMockReduxStore(state);

  renderComponent(store);

  expect(screen.getByTestId(loadingSpinnerTestId)).toBeInTheDocument();
});
