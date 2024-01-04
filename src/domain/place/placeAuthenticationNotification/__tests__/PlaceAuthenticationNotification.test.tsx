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
import { PLACE_ACTIONS } from '../../constants';
import PlaceAuthenticationNotification, {
  PlaceAuthenticationNotificationProps,
} from '../PlaceAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [mockedOrganizationAncestorsResponse];

const props: PlaceAuthenticationNotificationProps = {
  action: PLACE_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderoptions?: CustomRenderOptions) =>
  render(<PlaceAuthenticationNotification {...props} />, renderoptions);

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  screen.getByRole('heading', { name: 'Ei oikeuksia muokata paikkoja.' });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but it is different than publisher', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', { name: 'Paikkaa ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä paikkaa.');
});
