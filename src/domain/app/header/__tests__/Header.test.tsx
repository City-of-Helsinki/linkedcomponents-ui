import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import i18n from 'i18next';
import React from 'react';

import { ROUTES, TEST_USER_ID } from '../../../../constants';
import { UserDocument } from '../../../../generated/graphql';
import { StoreState } from '../../../../types';
import { fakeUser } from '../../../../utils/mockDataUtils';
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
import translations from '../../../app/i18n/fi.json';
import userManager from '../../../auth/userManager';
import Header from '../Header';

configure({ defaultHidden: true });

const userName = 'Test user';
const user = fakeUser({
  displayName: 'Test user',
});
const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

const mocks = [mockedUserResponse];

const renderComponent = (store?: Store<StoreState, AnyAction>, route = '/fi') =>
  render(<Header />, { mocks, routes: [route], store });

const getElement = (key: 'enOption' | 'menuButton') => {
  switch (key) {
    case 'enOption':
      return screen.getByRole('link', {
        hidden: false,
        name: translations.navigation.languages.en,
      });
    case 'menuButton':
      return screen.getByRole('button', {
        name: translations.navigation.menuToggleAriaLabel,
      });
  }
};

const getElements = (
  key: 'languageSelector' | 'signInButton' | 'signOutLink'
) => {
  switch (key) {
    case 'languageSelector':
      return screen.getAllByRole('button', {
        name: translations.navigation.languageSelectorAriaLabel,
      });
    case 'signInButton':
      return screen.getAllByRole('button', {
        name: translations.common.signIn,
      });
    case 'signOutLink':
      return screen.getAllByRole('link', {
        name: translations.common.signOut,
      });
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

test('should show navigation links and should route to correct page after clicking link', () => {
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

    userEvent.click(link);
    expect(history.location.pathname).toBe(url);
  });
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

test('should start log in process', () => {
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
