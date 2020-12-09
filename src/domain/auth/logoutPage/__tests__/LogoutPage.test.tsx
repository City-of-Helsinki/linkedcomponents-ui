import { AnyAction, Store } from '@reduxjs/toolkit';
import merge from 'lodash/merge';
import React from 'react';

import { testId as loadingSpinnerTestId } from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { defaultStoreState } from '../../../../constants';
import { StoreState } from '../../../../types';
import {
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import { API_CLIENT_ID } from '../../constants';
import userManager from '../../userManager';
import LogoutPage from '../LogoutPage';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<LogoutPage />, { routes: ['/fi/events'], store });

test('should render logout page', () => {
  renderComponent();

  expect(screen.getByText(translations.logoutPage.text)).toBeInTheDocument();

  const buttons = [
    translations.common.signIn,
    translations.logoutPage.buttonGoToHome,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });
});

test('should route to home page', () => {
  const { history } = renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.logoutPage.buttonGoToHome })
  );

  expect(history.location.pathname).toBe('/fi/');
});

test('should start log in process', () => {
  userManager.signinRedirect = jest.fn();
  (userManager.signinRedirect as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({})
  );
  renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.signIn })
  );

  expect(userManager.signinRedirect).toBeCalled();
});

test('should redirect to home page when use is authenticated', () => {
  const apiToken = { [API_CLIENT_ID]: 'api-token' };
  const user = { name: 'Test user' };
  const state = merge({}, defaultStoreState, {
    authentication: {
      oidc: { user },
      token: { apiToken },
    },
  });
  const store = getMockReduxStore(state);

  const { history } = renderComponent(store);

  expect(history.location.pathname).toBe('/fi/');
});

test('should render loading spinner when loading authenticion state', () => {
  const state = merge({}, defaultStoreState, {
    authentication: {
      oidc: { isLoadingUser: true },
    },
  });
  const store = getMockReduxStore(state);

  renderComponent(store);

  expect(screen.getByTestId(loadingSpinnerTestId)).toBeInTheDocument();
});
