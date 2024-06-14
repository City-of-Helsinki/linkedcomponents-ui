/* eslint-disable max-len */
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { getMockedUserResponse } from '../../../user/__mocks__/user';
import { PRICE_GROUP_ACTIONS } from '../../constants';
import PriceGroupAuthenticationNotification, {
  PriceGroupAuthenticationNotificationProps,
} from '../PriceGroupAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [mockedOrganizationAncestorsResponse];

const props: PriceGroupAuthenticationNotificationProps = {
  action: PRICE_GROUP_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderoptions?: CustomRenderOptions) =>
  render(<PriceGroupAuthenticationNotification {...props} />, renderoptions);

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  screen.getByRole('heading', { name: 'Ei oikeuksia muokata asiakasryhmiä.' });
});

test('should not show notification if user is signed in and has a financial admin organization', async () => {
  const mockedUserResponse = getMockedUserResponse({
    financialAdminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should not show notification if user is signed in and is superadmin', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    financialAdminOrganizations: [],
    organizationMemberships: [],
    isSuperuser: true,
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has a financial admin organization but it is different than publisher', async () => {
  const mockedUserResponse = getMockedUserResponse({
    financialAdminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', { name: 'Asiakasryhmää ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä asiakasryhmää.');
});
