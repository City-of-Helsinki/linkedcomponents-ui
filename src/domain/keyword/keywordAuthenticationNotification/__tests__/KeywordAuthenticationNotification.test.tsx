import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { getMockedUserResponse } from '../../../user/__mocks__/user';
import { KEYWORD_ACTIONS } from '../../constants';
import KeywordAuthenticationNotification, {
  KeywordAuthenticationNotificationProps,
} from '../KeywordAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [mockedOrganizationAncestorsResponse];

const props: KeywordAuthenticationNotificationProps = {
  action: KEYWORD_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordAuthenticationNotification {...props} />, renderOptions);

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', { name: 'Avainsanoja ei voi muokata.' });
  screen.getByText('Avainsanoja ei voi muokata palvelun kautta.');
});

test('should show notification if user is signed in and has an admin organization', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', { name: 'Avainsanoja ei voi muokata.' });
  screen.getByText('Avainsanoja ei voi muokata palvelun kautta.');
});

test('should show notification if user has an admin organization but it is different than publisher', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks });

  await screen.findByRole('heading', { name: 'Avainsanoja ei voi muokata.' });
  screen.getByText('Avainsanoja ei voi muokata palvelun kautta.');
});
