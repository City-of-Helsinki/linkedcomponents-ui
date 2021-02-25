import { AnyAction, Store } from '@reduxjs/toolkit';
import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import userManager from '../../../auth/userManager';
import Header from '../Header';

const renderComponent = (store?: Store<StoreState, AnyAction>, route = '/fi') =>
  render(<Header />, { routes: [route], store });

const findComponent = (
  key:
    | 'languageSelector'
    | 'menuButton'
    | 'navigation'
    | 'signInButton'
    | 'signOutLink'
    | 'svOption'
) => {
  switch (key) {
    case 'languageSelector':
      return screen.findByRole('button', {
        name: translations.navigation.languageSelectorAriaLabel,
      });
    case 'menuButton':
      return screen.findByRole('button', {
        name: translations.navigation.menuToggleAriaLabel,
      });
    case 'navigation':
      return screen.findByRole('navigation');
    case 'signInButton':
      return screen.findByRole('button', { name: translations.common.signIn });
    case 'signOutLink':
      return screen.findByRole('link', { name: translations.common.signOut });
    case 'svOption':
      return screen.findByRole('link', {
        name: translations.navigation.languages.sv,
      });
  }
};

beforeEach(() => {
  jest.restoreAllMocks();
  i18n.changeLanguage('fi');
});

test('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent(undefined, '/sv');

  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  const { history } = renderComponent();
  const links = [
    {
      name: translations.navigation.tabs.events,
      url: `/fi${ROUTES.EVENTS}`,
    },
    {
      name: translations.navigation.tabs.help,
      url: `/fi${ROUTES.HELP}`,
    },
  ];

  links.forEach(({ name, url }) => {
    const link = screen.getByRole('link', { name });

    expect(link).toBeInTheDocument();

    userEvent.click(link);

    expect(history.location.pathname).toBe(url);
  });
});

test('should show mobile menu', async () => {
  global.innerWidth = 500;
  renderComponent();

  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

  const menuButton = await findComponent('menuButton');
  userEvent.click(menuButton);

  await findComponent('navigation');
});

test('should change language', async () => {
  global.innerWidth = 1200;
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi');

  const languageSelectorButton = await findComponent('languageSelector');
  userEvent.click(languageSelectorButton);

  const svOption = await findComponent('svOption');
  userEvent.click(svOption);

  expect(history.location.pathname).toBe('/sv');
});

test('should start log in process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButton = await findComponent('signInButton');
  userEvent.click(signInButton);

  expect(signinRedirect).toBeCalled();
});

test('should start logout process', async () => {
  const signoutRedirect = jest.spyOn(userManager, 'signoutRedirect');

  const storeState = fakeAuthenticatedStoreState();
  const userName = storeState.authentication.oidc.user.profile.name;
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  const userMenuButton = await screen.findByRole('button', { name: userName });
  userEvent.click(userMenuButton);

  const signOutLink = await findComponent('signOutLink');
  userEvent.click(signOutLink);

  await waitFor(() => {
    expect(signoutRedirect).toBeCalled();
  });
});

test('should route to search page', async () => {
  const searchValue = 'search';
  const { history } = renderComponent();

  const openSearchButton = await screen.findByRole('button', {
    name: 'Etsi tapahtumia',
  });
  userEvent.click(openSearchButton);

  const searchInput = screen.getByPlaceholderText('Etsi tapahtumia');
  userEvent.click(searchInput);
  userEvent.type(searchInput, searchValue);
  userEvent.type(searchInput, '{enter}');

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
