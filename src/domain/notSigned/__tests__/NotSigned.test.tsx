import React from 'react';

import { fakeAuthContextValue } from '../../../utils/mockAuthContextValue';
import { configure, render, screen, userEvent } from '../../../utils/testUtils';
import { AuthContextProps } from '../../auth/types';
import NotSigned from '../NotSigned';

configure({ defaultHidden: true });

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(<NotSigned />, { routes: ['/fi/events'], authContextValue });

const getElement = (key: 'goToHomeButton' | 'signInButton' | 'text') => {
  switch (key) {
    case 'goToHomeButton':
      return screen.getByRole('button', { name: 'Etusivulle' });
    case 'signInButton':
      return screen.getByRole('button', { name: 'Kirjaudu sisään' });
    case 'text':
      return screen.getByText(
        'Sinun täytyy olla kirjautuneena sisään tarkastellaksesi tätä sisältöä. Kirjaudu sisään tai palaa etusivulle.'
      );
  }
};

test('should render not signed page', async () => {
  renderComponent();

  getElement('text');
  getElement('signInButton');
  getElement('goToHomeButton');
});

test('should route to home page', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  const goToHomeButton = getElement('goToHomeButton');
  await user.click(goToHomeButton);

  expect(history.location.pathname).toBe('/fi/');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const signIn = vi.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent(authContextValue);

  const signInButton = getElement('signInButton');
  await user.click(signInButton);

  expect(signIn).toBeCalled();
});
