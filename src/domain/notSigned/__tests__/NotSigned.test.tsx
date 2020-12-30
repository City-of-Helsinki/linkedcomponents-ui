import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { StoreState } from '../../../types';
import { render, screen, userEvent } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import userManager from '../../auth/userManager';
import NotSigned from '../NotSigned';

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<NotSigned />, { routes: ['/fi/events'], store });

const findComponent = (key: 'goToHomeButton' | 'signInButton' | 'text') => {
  switch (key) {
    case 'goToHomeButton':
      return screen.findByRole('button', {
        name: translations.common.goToHome,
      });
    case 'signInButton':
      return screen.findByRole('button', { name: translations.common.signIn });
    case 'text':
      return screen.findByText(translations.notSigned.text);
  }
};

test('should render not signed page', async () => {
  renderComponent();

  await findComponent('text');
  await findComponent('signInButton');
  await findComponent('goToHomeButton');
});

test('should route to home page', async () => {
  const { history } = renderComponent();
  const goToHomeButton = await findComponent('goToHomeButton');

  userEvent.click(goToHomeButton);

  expect(history.location.pathname).toBe('/fi/');
});

test('should start log in process', async () => {
  userManager.signinRedirect = jest.fn();
  (userManager.signinRedirect as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({})
  );
  renderComponent();
  const signInButton = await findComponent('signInButton');

  userEvent.click(signInButton);

  expect(userManager.signinRedirect).toBeCalled();
});
