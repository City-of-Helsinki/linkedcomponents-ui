import { AnyAction, Store } from '@reduxjs/toolkit';
import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import userManager from '../../../auth/userManager';
import { mockedUserResponse, userName } from '../../../user/__mocks__/user';
import Header from '../Header';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (store?: Store<StoreState, AnyAction>, route = '/fi') =>
  render(<Header />, { mocks, routes: [route], store });

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
test.skip('matches snapshot', () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent(undefined, '/sv');

  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  setFeatureFlags({ SHOW_KEYWORD: true, SHOW_REGISTRATION: true });
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /ilmoittautuminen/i, url: `/fi${ROUTES.REGISTRATIONS}` },
    { name: /avainsanat/i, url: `/fi${ROUTES.KEYWORDS}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    userEvent.click(link);

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  const homeLink = screen.getAllByRole('link', { name: /linked events/i })[0];

  userEvent.click(homeLink);
  expect(history.location.pathname).toBe(`/fi${ROUTES.HOME}`);
});

test('should not show keywords and registrations link when those features are disabled', async () => {
  setFeatureFlags({ SHOW_KEYWORD: false, SHOW_REGISTRATION: false });

  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    userEvent.click(link);

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  expect(
    screen.queryByRole('link', { name: /avainsanat/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /ilmoittautuminen/i })
  ).not.toBeInTheDocument();
});

test('should show mobile menu', async () => {
  global.innerWidth = 500;
  renderComponent();

  expect(screen.getAllByRole('navigation')).toHaveLength(1);

  const menuButton = getElement('menuButton');
  userEvent.click(menuButton);

  await waitFor(() =>
    expect(screen.getAllByRole('navigation')).toHaveLength(2)
  );
});

test('should change language', () => {
  global.innerWidth = 1200;
  const { history } = renderComponent();

  expect(history.location.pathname).toBe('/fi');

  const languageSelectors = getElements('languageSelector');
  userEvent.click(languageSelectors[0]);

  const enOption = getElement('enOption');
  userEvent.click(enOption);

  expect(history.location.pathname).toBe('/en');
});

test('should start login process', () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButtons = getElements('signInButton');
  userEvent.click(signInButtons[0]);

  expect(signinRedirect).toBeCalled();
});

test('should start logout process', async () => {
  const signoutRedirect = jest.spyOn(userManager, 'signoutRedirect');

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  const userMenuButton = await screen.findByRole('button', { name: userName });
  userEvent.click(userMenuButton);

  const signOutLinks = getElements('signOutLink');
  act(() => userEvent.click(signOutLinks[0]));

  await waitFor(() => expect(signoutRedirect).toBeCalled());
});

test('should route to search page', () => {
  const searchValue = 'search';
  const { history } = renderComponent();

  const openSearchButton = screen.getByRole('button', {
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
