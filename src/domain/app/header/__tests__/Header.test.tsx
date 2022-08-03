/* eslint-disable import/no-named-as-default-member */
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
  setFeatureFlags({ SHOW_ADMIN: true, SHOW_REGISTRATION: true });
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

    await act(async () => await user.click(link));

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  const homeLink = screen.getAllByRole('link', { name: /linked events/i })[0];

  await act(async () => await user.click(homeLink));
  expect(history.location.pathname).toBe(`/fi${ROUTES.HOME}`);
});

test('should not show keywords and registrations link when those features are disabled', async () => {
  setFeatureFlags({ SHOW_ADMIN: false, SHOW_REGISTRATION: false });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    await act(async () => await user.click(link));

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
  await act(async () => await user.click(menuButton));

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
  await act(async () => await user.click(languageSelectors[0]));

  const enOption = getElement('enOption');
  await act(async () => await user.click(enOption));

  expect(history.location.pathname).toBe('/en');
});

test('should start login process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
  const user = userEvent.setup();
  renderComponent();

  const signInButtons = getElements('signInButton');
  await act(async () => await user.click(signInButtons[0]));

  expect(signinRedirect).toBeCalled();
});

test('should start logout process', async () => {
  const signoutRedirect = jest.spyOn(userManager, 'signoutRedirect');

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  const user = userEvent.setup();
  renderComponent(store);

  const userMenuButton = await screen.findByRole(
    'button',
    { name: userName },
    { timeout: 10000 }
  );
  await act(async () => await user.click(userMenuButton));

  const signOutLinks = getElements('signOutLink');
  await act(async () => await user.click(signOutLinks[0]));

  await waitFor(() => expect(signoutRedirect).toBeCalled());
});

test('should route to search page', async () => {
  const searchValue = 'search';
  const user = userEvent.setup();
  const { history } = renderComponent();

  const openSearchButton = screen.getByRole('button', {
    name: 'Etsi tapahtumia',
  });
  await act(async () => await user.click(openSearchButton));

  const searchInput = screen.getByPlaceholderText('Etsi tapahtumia');
  await act(async () => await user.click(searchInput));
  await act(async () => await user.type(searchInput, searchValue));
  await act(async () => await user.type(searchInput, '{enter}'));

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
