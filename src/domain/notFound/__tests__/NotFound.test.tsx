import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { StoreState } from '../../../types';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import userManager from '../../auth/userManager';
import NotFound from '../NotFound';

configure({ defaultHidden: true });

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<NotFound />, { routes: ['/fi/events'], store });

const getElement = (key: 'buttonHome' | 'buttonSignIn') => {
  switch (key) {
    case 'buttonHome':
      return screen.getByRole('button', { name: 'Etusivulle' });
    case 'buttonSignIn':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
  }
};

test('should render not found page', () => {
  renderComponent();

  expect(screen.getByText(translations.notFound.text)).toBeInTheDocument();
  getElement('buttonHome');
  getElement('buttonSignIn');
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
