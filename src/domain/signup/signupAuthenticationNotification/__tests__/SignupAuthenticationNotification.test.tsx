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
import { registration } from '../../../registration/__mocks__/registration';
import {
  getMockedUserResponse,
  mockedRegistrationUserResponse,
} from '../../../user/__mocks__/user';
import { SIGNUP_ACTIONS } from '../../constants';
import SignupAuthenticationNotification from '../SignupAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(
    <SignupAuthenticationNotification
      action={SIGNUP_ACTIONS.UPDATE}
      registration={registration}
    />,
    renderOptions
  );

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [
    mockedEventResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserResponse,
  ];

  renderComponent({ mocks });

  screen.getByRole('region');
  screen.getByRole('heading', { name: 'Ei oikeuksia muokata osallistujia.' });
});

test('should not show notification if user is signed in and has an registration admin organization', async () => {
  const mocks = [
    mockedEventResponse,
    mockedOrganizationAncestorsResponse,
    mockedRegistrationUserResponse,
  ];

  renderComponent({ mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});
