import React from 'react';

import { fakeAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import { AuthContextProps } from '../../auth/types';
import NotFound from '../NotFound';

configure({ defaultHidden: true });

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(<NotFound />, { routes: ['/fi/events'], authContextValue });

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
  const user = userEvent.setup();

  const signIn = jest.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent(authContextValue);

  await act(async () => await user.click(getElement('buttonSignIn')));

  expect(signIn).toBeCalled();
});
