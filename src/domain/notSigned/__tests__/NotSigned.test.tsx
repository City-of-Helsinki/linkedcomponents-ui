import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { StoreState } from '../../../types';
import { render, screen, userEvent } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import userManager from '../../auth/userManager';
import NotSigned from '../NotSigned';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<NotSigned />, { routes: ['/fi/events'], store });

const getElement = (key: 'goToHomeButton' | 'signInButton' | 'text') => {
  switch (key) {
    case 'goToHomeButton':
      return screen.getByRole('button', {
        name: translations.common.goToHome,
      });
    case 'signInButton':
      return screen.getByRole('button', { name: translations.common.signIn });
    case 'text':
      return screen.getByText(translations.notSigned.text);
  }
};

test('should render not signed page', async () => {
  renderComponent();

  getElement('text');
  getElement('signInButton');
  getElement('goToHomeButton');
});

test('should route to home page', async () => {
  const { history } = renderComponent();
  const goToHomeButton = getElement('goToHomeButton');

  userEvent.click(goToHomeButton);

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
  renderComponent();
  const signInButton = getElement('signInButton');

  userEvent.click(signInButton);

  expect(signinRedirect).toBeCalled();
});
