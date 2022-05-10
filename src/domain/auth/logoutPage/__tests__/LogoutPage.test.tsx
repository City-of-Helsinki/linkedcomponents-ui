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
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import userManager from '../../userManager';
import LogoutPage from '../LogoutPage';

configure({ defaultHidden: true });

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<LogoutPage />, { routes: ['/fi/events'], store });

const getElement = (key: 'buttonHome' | 'buttonSignIn' | 'text') => {
  switch (key) {
    case 'buttonHome':
      return screen.getByRole('button', { name: 'Takaisin etusivulle' });
    case 'buttonSignIn':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
    case 'text':
      return screen.getByText(translations.logoutPage.text);
  }
};

test('should render logout page', () => {
  renderComponent();

  getElement('text');
  getElement('buttonSignIn');
  getElement('buttonHome');
});

test('should route to home page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await act(async () => await user.click(getElement('buttonHome')));

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
  const user = userEvent.setup();
  renderComponent();

  await act(async () => await user.click(getElement('buttonSignIn')));

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
