/* eslint-disable import/no-named-as-default-member */
import { MockedResponse } from '@apollo/client/testing';
import i18n from 'i18next';
import React from 'react';
import { vi } from 'vitest';

import { DATA_PROTECTION_URL, ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
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

configure({ defaultHidden: true });

beforeEach(() => {
  i18n.changeLanguage('fi');
});

const renderComponent = ({
  authContextValue = fakeAuthenticatedAuthContextValue(),
  mocks = [mockedUserResponse],
  route = '/fi',
} = {}) => render(<Footer />, { authContextValue, mocks, routes: [route] });

// TODO: Swedish language is disabled at the moment, so skip this test
test.skip('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent({ route: '/sv' });

  screen.getByRole('link', { name: 'Evenemang' });
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
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
    { name: /ilmoittautuminen/i, url: `/fi${ROUTES.REGISTRATIONS}` },
    { name: /hallinta/i, url: `/fi${ROUTES.ADMIN}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getByRole('link', { name });

    await user.click(link);

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  const dataProtectionLink = screen.getByRole('link', { name: /tietosuoja/i });

  expect(dataProtectionLink.getAttribute('href')).toEqual(
    DATA_PROTECTION_URL['fi']
  );

  window.open = vi.fn();

  await user.click(dataProtectionLink);

  expect(window.open).toHaveBeenCalled();
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
      SHOW_REGISTRATION: true,
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

test('should not show admin and registration links when those features are disabled', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: false,
    SHOW_REGISTRATION: false,
  });
  const user = userEvent.setup();

  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
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

test('should show feedback link and link should have correct href', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const feedbackLink = screen.getByRole('link', { name: /anna palautetta/i });
  await user.click(feedbackLink);

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
