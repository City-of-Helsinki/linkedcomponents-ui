import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { StoreState } from '../../../types';
import { render, screen, userEvent } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import userManager from '../../auth/userManager';
import NotFound from '../NotFound';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<NotFound />, { routes: ['/fi/events'], store });

test('should render not found page', () => {
  renderComponent();

  expect(screen.getByText(translations.notFound.text)).toBeInTheDocument();

  const buttons = [translations.common.signIn, translations.common.goToHome];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });
});

test('should route to home page', () => {
  const { history } = renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.goToHome })
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
