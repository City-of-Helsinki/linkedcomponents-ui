/* eslint-disable import/no-named-as-default-member */
import { MockedResponse } from '@apollo/client/testing';
import i18n from 'i18next';

import { ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedRegistrationUserResponse,
  mockedRegularUserResponse,
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
  userFirstName,
} from '../../../user/__mocks__/user';
import Header from '../Header';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
  i18n.changeLanguage('fi');
});

const defaultMocks = [mockedUserResponse];

const renderComponent = ({
  mocks = defaultMocks,
  route = '/fi',
}: {
  mocks?: MockedResponse[];
  route?: string;
} = {}) => render(<Header />, { mocks, routes: [route] });

const getElement = (key: 'fiOption' | 'enOption' | 'menuButton') => {
  switch (key) {
    case 'fiOption':
      return screen.getByRole('button', { hidden: false, name: /suomeksi/i });
    case 'enOption':
      return screen.getByRole('button', { hidden: false, name: /in english/i });
    case 'menuButton':
      return screen.getByRole('button', { name: 'Valikko' });
  }
};

const getElements = (key: 'signInButton' | 'signOutLink') => {
  switch (key) {
    case 'signInButton':
      return screen.getAllByRole('button', { name: /kirjaudu sisään/i });
    case 'signOutLink':
      return screen.getAllByRole('link', { name: /kirjaudu ulos/i });
  }
};

const findUserMenuButton = () =>
  screen.findByRole('button', { name: userFirstName }, { timeout: 10000 });

// TODO: Skip this test because SV UI language is temporarily disabled
test.skip('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent({ route: '/sv' });

  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
  });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
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

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi${ROUTES.HOME}`)
  );
});

const registrationAndAdminTabTestCases: {
  role: string;
  showRegistrationTab: boolean;
  showAdminTab: boolean;
}[] = [
  { role: 'admin', showAdminTab: true, showRegistrationTab: true },
  {
    role: 'registrationAdmin',
    showAdminTab: false,
    showRegistrationTab: true,
  },
  { role: 'regularUser', showAdminTab: false, showRegistrationTab: false },
  { role: 'noOrganization', showAdminTab: false, showRegistrationTab: false },
];

test.each(registrationAndAdminTabTestCases)(
  'should show admin and registration links if user has sufficient permissions, %p',
  async ({ role, showAdminTab, showRegistrationTab }) => {
    setFeatureFlags({
      LOCALIZED_IMAGE: true,
      SHOW_ADMIN: true,
    });
    const userMocks: Record<typeof role, MockedResponse> = {
      admin: mockedUserResponse,
      noOrganization: mockedUserWithoutOrganizationsResponse,
      registrationAdmin: mockedRegistrationUserResponse,
      regularUser: mockedRegularUserResponse,
    };

    renderComponent({ mocks: [userMocks[role]] });
    await findUserMenuButton();

    if (showAdminTab) {
      expect(
        await screen.findByRole('link', { name: /hallinta/i })
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByRole('link', { name: /hallinta/i })
      ).not.toBeInTheDocument();
    }
    if (showRegistrationTab) {
      expect(
        await screen.findByRole('link', { name: /ilmoittautuminen/i })
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByRole('link', { name: /ilmoittautuminen/i })
      ).not.toBeInTheDocument();
    }
  }
);

test('should not show admin and registrations link when those features are disabled', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: false,
  });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /ilmoittautuminen/i, url: `/fi${ROUTES.REGISTRATIONS}` },
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
});

test('should show mobile menu', async () => {
  global.innerWidth = 500;
  const user = userEvent.setup();
  renderComponent();

  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

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

  const fiOption = getElement('fiOption');
  await user.click(fiOption);

  const enOption = getElement('enOption');
  await user.click(enOption);

  expect(history.location.pathname).toBe('/en');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const login = vi.fn();
  mockUnauthenticatedLoginState({ login });
  renderComponent();

  const signInButtons = getElements('signInButton');
  await user.click(signInButtons[0]);
  expect(login).toBeCalled();
});

test('should start logout process', async () => {
  const user = userEvent.setup();

  const logout = vi.fn();
  mockAuthenticatedLoginState({ logout });
  renderComponent();

  const userMenuButton = await findUserMenuButton();
  await user.click(userMenuButton);

  const signOutLinks = getElements('signOutLink');
  await user.click(signOutLinks[0]);

  await waitFor(() => expect(logout).toBeCalled());
});
