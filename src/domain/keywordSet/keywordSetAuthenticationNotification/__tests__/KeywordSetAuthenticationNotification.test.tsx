import {
  getMockedUserResponse,
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../domain/user/__mocks__/user';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { KEYWORD_SET_ACTIONS } from '../../constants';
import KeywordSetAuthenticationNotification, {
  KeywordSetAuthenticationNotificationProps,
} from '../KeywordSetAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const props: KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS.UPDATE,
  organization: TEST_PUBLISHER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordSetAuthenticationNotification {...props} />, renderOptions);

const defaultMocks = [mockedEventResponse, mockedOrganizationAncestorsResponse];

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mocks = [...defaultMocks, mockedUserWithoutOrganizationsResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', {
    name: 'Ei oikeuksia muokata avainsanaryhmiä.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but to different organization', async () => {
  const organizationId = 'not-publisher';

  const mockedUserResponse = getMockedUserResponse({
    organization: organizationId,
    adminOrganizations: [organizationId],
    organizationMemberships: [organizationId],
  });

  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', {
    name: 'Avainsanaryhmää ei voi muokata',
  });
  await screen.findByText(
    'Sinulla ei ole oikeuksia muokata tätä avainsanaryhmää.'
  );
});
