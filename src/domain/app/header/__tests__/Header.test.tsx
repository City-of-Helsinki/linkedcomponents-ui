import { AnyAction, Store } from '@reduxjs/toolkit';
import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import userManager from '../../../auth/userManager';
import Header from '../Header';

configure({ defaultHidden: true });

const renderComponent = (store?: Store<StoreState, AnyAction>, route = '/fi') =>
  render(<Header />, { routes: [route], store });

const findComponent = (key: 'enOption' | 'menuButton') => {
  switch (key) {
    case 'enOption':
      return screen.findByRole('link', {
        hidden: false,
        name: translations.navigation.languages.en,
      });
    case 'menuButton':
      return screen.findByRole('button', {
        name: translations.navigation.menuToggleAriaLabel,
      });
  }
};

const findComponents = (
  key: 'languageSelector' | 'signInButton' | 'signOutLink'
) => {
  switch (key) {
    case 'languageSelector':
      return screen.findAllByRole('button', {
        name: translations.navigation.languageSelectorAriaLabel,
      });
    case 'signInButton':
      return screen.findAllByRole('button', {
        name: translations.common.signIn,
      });
    case 'signOutLink':
      return screen.findAllByRole('link', {
        name: translations.common.signOut,
      });
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
    const link = screen.getAllByRole('link', { name })[0];

    expect(link).toBeInTheDocument();

    userEvent.click(link);

    expect(history.location.pathname).toBe(url);
  });
});

test('should show mobile menu', async () => {
  global.innerWidth = 500;
  renderComponent();

  expect(screen.getAllByRole('navigation')).toHaveLength(1);

  const menuButton = await findComponent('menuButton');
  userEvent.click(menuButton);

  expect(screen.getAllByRole('navigation')).toHaveLength(2);
});

test('should change language', async () => {
  global.innerWidth = 1200;
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi');

  const languageSelectors = await findComponents('languageSelector');
  userEvent.click(languageSelectors[0]);

  const enOption = await findComponent('enOption');
  userEvent.click(enOption);

  expect(history.location.pathname).toBe('/en');
});

test('should start log in process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButtons = await findComponents('signInButton');
  userEvent.click(signInButtons[0]);

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

  const signOutLinks = await findComponents('signOutLink');
  userEvent.click(signOutLinks[0]);

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
