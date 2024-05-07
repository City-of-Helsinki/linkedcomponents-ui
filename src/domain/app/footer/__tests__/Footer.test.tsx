/* eslint-disable import/no-named-as-default-member */
import { MockedResponse } from '@apollo/client/testing';
import i18n from 'i18next';

import { DATA_PROTECTION_URL, ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
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
} from '../../../user/__mocks__/user';
import Footer from '../Footer';

const mockedUseNavigate = vi.fn();

vi.mock('react-router', async () => {
  return {
    ...((await vi.importActual('react-router')) as object),
    useNavigate: () => mockedUseNavigate,
  };
});

configure({ defaultHidden: true });

beforeEach(() => {
  mockAuthenticatedLoginState();
  i18n.changeLanguage('fi');
});

afterEach(() => {
  vi.resetAllMocks();
});

const renderComponent = ({
  mocks = [mockedUserResponse],
  route = '/fi',
} = {}) => render(<Footer />, { mocks, routes: [route] });

test('matches snapshot', async () => {
  mockAuthenticatedLoginState();
  i18n.changeLanguage('sv');

  const { container } = renderComponent({ route: '/sv' });

  screen.getByRole('link', { name: 'Mina evenemangen' });
  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });

  const user = userEvent.setup();
  renderComponent();
  const links = [
    { name: /etusivu/i, url: `/fi${ROUTES.HOME}` },
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: 'Ilmoittautuminen', url: `/fi${ROUTES.REGISTRATIONS}` },
    { name: 'Hallinta', url: `/fi${ROUTES.ADMIN}` },
    { name: /ohjeet/i, url: `/fi${ROUTES.INSTRUCTIONS}` },
    { name: /teknologia/i, url: `/fi${ROUTES.TECHNOLOGY}` },
    { name: /tietoa palvelusta/i, url: `/fi${ROUTES.SUPPORT}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    await user.click(link);

    await waitFor(() =>
      expect(mockedUseNavigate).toBeCalledWith({
        pathname: url,
      })
    );
  }
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
      SWEDISH_TRANSLATIONS: true,
      WEB_STORE_INTEGRATION: true,
    });

    const userMocks: Record<typeof role, MockedResponse> = {
      admin: mockedUserResponse,
      noOrganization: mockedUserWithoutOrganizationsResponse,
      registrationAdmin: mockedRegistrationUserResponse,
      regularUser: mockedRegularUserResponse,
    };

    renderComponent({ mocks: [userMocks[role]] });

    if (showAdminTab) {
      expect(
        await screen.findByRole('link', { name: 'Hallinta' })
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByRole('link', { name: 'Hallinta' })
      ).not.toBeInTheDocument();
    }
    if (showRegistrationTab) {
      expect(
        await screen.findByRole('link', { name: 'Ilmoittautuminen' })
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByRole('link', { name: 'Ilmoittautuminen' })
      ).not.toBeInTheDocument();
    }
  }
);

test('should not show admin links when those features are disabled', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: false,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });

  renderComponent();

  expect(
    screen.queryByRole('link', { name: 'Hallinta' })
  ).not.toBeInTheDocument();
});

test('should show and open utility links', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });

  const user = userEvent.setup();
  renderComponent();

  const accessibilityStatementLink = screen.getByRole('link', {
    name: /saavutettavuusseloste/i,
  });

  await user.click(accessibilityStatementLink);

  await waitFor(() =>
    expect(mockedUseNavigate).toBeCalledWith({
      pathname: `/fi${ROUTES.ACCESSIBILITY_STATEMENT}`,
    })
  );

  const dataProtectionLink = screen.getByRole('link', { name: /tietosuoja/i });

  expect(dataProtectionLink.getAttribute('href')).toEqual(
    DATA_PROTECTION_URL['fi']
  );

  window.open = vi.fn();

  await user.click(dataProtectionLink);

  expect(window.open).toHaveBeenCalled();
});
