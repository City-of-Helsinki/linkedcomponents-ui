import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { act, render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import Header, { HeaderProps } from '../Header';

const defaultProps: HeaderProps = {
  menuOpen: false,
  onMenuToggle: jest.fn(),
};
const renderComponent = (props?: Partial<HeaderProps>, route = '/fi') =>
  render(<Header {...defaultProps} {...props} />, { routes: [route] });

beforeEach(() => {
  act(() => {
    i18n.changeLanguage('fi');
  });
});

test('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent(undefined, '/sv');

  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and click should route to correct pages', async () => {
  const { history } = renderComponent();
  const links = [
    {
      name: translations.navigation.tabs.createEvent,
      url: `/fi${ROUTES.CREATE_EVENT}`,
    },
    {
      name: translations.navigation.tabs.searchEvent,
      url: `/fi${ROUTES.SEARCH}`,
    },
    {
      name: translations.navigation.tabs.help,
      url: `/fi${ROUTES.HELP}`,
    },
  ];

  links.forEach(({ name, url }) => {
    const link = screen.queryByRole('link', { name });

    expect(link).toBeInTheDocument();

    userEvent.click(link);
    expect(history.location.pathname).toBe(url);
  });
});

test('onMenuToggle function should be called', async () => {
  global.innerWidth = 500;
  const onMenuToggle = jest.fn();
  renderComponent({ onMenuToggle });

  const button = screen.getByRole('button', {
    name: translations.navigation.menuToggleAriaLabel,
  });

  userEvent.click(button);
  expect(onMenuToggle).toBeCalled();
});

test('should change language', async () => {
  global.innerWidth = 1200;
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi');

  const button = screen.getByRole('button', {
    name: translations.navigation.languageSelectorAriaLabel,
  });
  userEvent.click(button);

  const svOption = screen.getByRole('link', {
    name: translations.navigation.languages.sv,
  });
  userEvent.click(svOption);

  expect(history.location.pathname).toBe('/sv');
});
