/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { mockedUserResponse, userName } from '../../../user/__mocks__/user';
import Header from '../Header';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (authContextValue?: AuthContextProps, route = '/fi') =>
  render(<Header />, { authContextValue, mocks, routes: [route] });

const getElement = (key: 'enOption' | 'menuButton') => {
  switch (key) {
    case 'enOption':
      return screen.getByRole('link', { hidden: false, name: /in english/i });
    case 'menuButton':
      return screen.getByRole('button', { name: 'Valikko' });
  }
};

const getElements = (
  key: 'languageSelector' | 'signInButton' | 'signOutLink'
) => {
  switch (key) {
    case 'languageSelector':
      return screen.getAllByRole('button', { name: /suomi - kielivalikko/i });
    case 'signInButton':
      return screen.getAllByRole('button', { name: /kirjaudu sisään/i });
    case 'signOutLink':
      return screen.getAllByRole('link', { name: /kirjaudu ulos/i });
  }
};

beforeEach(() => {
  jest.restoreAllMocks();
  i18n.changeLanguage('fi');
});

// TODO: Skip this test because SV UI language is temporarily disabled
test.skip('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent(undefined, '/sv');

  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SHOW_REGISTRATION: true,
  });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /ilmoittautuminen/i, url: `/fi${ROUTES.REGISTRATIONS}` },
    { name: /hallinta/i, url: `/fi${ROUTES.ADMIN}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    await user.click(link);

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  const homeLink = screen.getAllByRole('link', { name: /linked events/i })[0];

  await user.click(homeLink);
  expect(history.location.pathname).toBe(`/fi${ROUTES.HOME}`);
});

test('should not show keywords and registrations link when those features are disabled', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: false,
    SHOW_REGISTRATION: false,
  });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    await user.click(link);

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  expect(
    screen.queryByRole('link', { name: /hallinta/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /ilmoittautuminen/i })
  ).not.toBeInTheDocument();
});

test('should show mobile menu', async () => {
  global.innerWidth = 500;
  const user = userEvent.setup();
  renderComponent();

  expect(screen.getAllByRole('navigation')).toHaveLength(1);

  const menuButton = getElement('menuButton');
  await user.click(menuButton);

  await waitFor(() =>
    expect(screen.getAllByRole('navigation')).toHaveLength(2)
  );
});

test('should change language', async () => {
  global.innerWidth = 1200;
  const user = userEvent.setup();
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi');

  const languageSelectors = getElements('languageSelector');
  await user.click(languageSelectors[0]);

  const enOption = getElement('enOption');
  await user.click(enOption);

  expect(history.location.pathname).toBe('/en');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const signIn = jest.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent(authContextValue);

  const signInButtons = getElements('signInButton');
  await user.click(signInButtons[0]);
  expect(signIn).toBeCalled();
});

test('should start logout process', async () => {
  const user = userEvent.setup();

  const signOut = jest.fn();
  const authContextValue = fakeAuthenticatedAuthContextValue({ signOut });
  renderComponent(authContextValue);

  const userMenuButton = await screen.findByRole(
    'button',
    { name: userName },
    { timeout: 10000 }
  );
  await user.click(userMenuButton);

  const signOutLinks = getElements('signOutLink');
  await user.click(signOutLinks[0]);

  await waitFor(() => expect(signOut).toBeCalled());
});

test('should route to search page', async () => {
  const searchValue = 'search';
  const user = userEvent.setup();
  const { history } = renderComponent();

  const openSearchButton = screen.getByRole('button', {
    name: 'Etsi tapahtumia',
  });
  await user.click(openSearchButton);

  const searchInput = screen.getByPlaceholderText('Etsi tapahtumia');
  await user.type(searchInput, searchValue);
  await user.type(searchInput, '{enter}');

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
