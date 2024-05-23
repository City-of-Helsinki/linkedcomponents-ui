import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../../constants';
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
  mockedFinancialAdminUserResponse,
  mockedSuperuserResponse,
  mockedUserResponse,
} from '../../../user/__mocks__/user';
import AdminPageLayout from '../AdminPageLayout';

configure({ defaultHidden: true });

beforeEach(() => {
  mockAuthenticatedLoginState();

  setFeatureFlags({
    SHOW_ADMIN: true,
    SHOW_PLACE_PAGES: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });
});

const defaultMocks = [mockedSuperuserResponse];

const route = `/fi${ROUTES.KEYWORDS}`;
const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<AdminPageLayout>Content</AdminPageLayout>, {
    routes: [route],
    mocks,
  });

const shouldRenderDefaultTabs = () => {
  screen.getByRole('link', { name: 'Avainsanat' });
  screen.getByRole('link', { name: 'Avainsanaryhmät' });
  screen.getByRole('link', { name: 'Kuvat' });
  screen.getByRole('link', { name: 'Paikat' });
};

const shouldRenderFinancialAdminTabs = async () => {
  await screen.findByRole('link', { name: 'Organisaatiot' });
  screen.getByRole('link', { name: 'Asiakasryhmät' });
};

const shouldNotRenderFinancialAdminTabs = async () => {
  expect(
    screen.queryByRole('link', { name: 'Asiakasryhmät' })
  ).not.toBeInTheDocument();
};

test('should render admin page layout', async () => {
  renderComponent();

  screen.getByRole('button', { name: 'Hallinta' });
  screen.getByRole('link', { name: 'Avainsanat' });
});

test('should render valid side navigation links for admin user', async () => {
  renderComponent([mockedUserResponse]);
  shouldRenderDefaultTabs();
  shouldNotRenderFinancialAdminTabs();
});

test('should render valid side navigation links for financial admin user', async () => {
  renderComponent([mockedFinancialAdminUserResponse]);
  shouldRenderDefaultTabs();
  await shouldRenderFinancialAdminTabs();
});

test('should render valid side navigation links for superuser', async () => {
  renderComponent([mockedSuperuserResponse]);
  shouldRenderDefaultTabs();
  await shouldRenderFinancialAdminTabs();
});

test('should route to keywords page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const keywordsLink = screen.getByRole('link', { name: 'Avainsanat' });
  await user.click(keywordsLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/administration/keywords')
  );
});
