import i18n from 'i18next';
import React from 'react';

import { act, render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import Header, { HeaderProps } from '../Header';

const defaultProps: HeaderProps = {
  menuOpen: false,
  onMenuToggle: jest.fn(),
};
const getWrapper = (props?: Partial<HeaderProps>, route = '/fi') =>
  render(<Header {...defaultProps} {...props} />, { routes: [route] });

beforeEach(() => {
  act(() => {
    i18n.changeLanguage('fi');
  });
});

test('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = getWrapper(undefined, '/sv');

  expect(container.firstChild).toMatchSnapshot();
});

test('onMenuToggle function should be called', async () => {
  global.innerWidth = 500;
  const onMenuToggle = jest.fn();
  getWrapper({ onMenuToggle });

  const button = screen.getByRole('button', {
    name: translations.navigation.menuOpenAriaLabel,
  });

  userEvent.click(button);
  expect(onMenuToggle).toBeCalled();
});

test('should change language', async () => {
  global.innerWidth = 1200;
  const { history } = getWrapper();

  expect(history.location.pathname).toBe('/fi');

  const button = screen.getByRole('button', {
    name: `${translations.navigation.languageSelectorAriaLabel} FI`,
  });
  userEvent.click(button);

  const svOption = screen.getByRole('option', {
    name: translations.navigation.languages.sv,
  });
  userEvent.click(svOption);

  expect(history.location.pathname).toBe('/sv');
});
