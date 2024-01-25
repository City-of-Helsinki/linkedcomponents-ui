import { fakeRegistration } from '../../../../utils/mockDataUtils';
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
import { registration } from '../../../registration/__mocks__/registration';
import { REGISTRATION_ACTIONS } from '../../../registrations/constants';
import {
  getMockedUserResponse,
  mockedUserResponse,
} from '../../../user/__mocks__/user';
import RegistrationAuthenticationNotification, {
  RegistrationAuthenticationNotificationProps,
} from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [mockedEventResponse, mockedOrganizationAncestorsResponse];

const renderComponent = ({
  props,
  renderOptions,
}: {
  props?: Partial<RegistrationAuthenticationNotificationProps>;
  renderOptions?: CustomRenderOptions;
} = {}) =>
  render(
    <RegistrationAuthenticationNotification
      action={REGISTRATION_ACTIONS.UPDATE}
      registration={registration}
      {...props}
    />,
    renderOptions
  );

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ renderOptions: { mocks } });

  screen.getByRole('region');
  screen.getByRole('heading', {
    name: 'Ei oikeuksia muokata ilmoittautumisia.',
  });
});

test('should show notification if user has an admin organization but the id is different', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ renderOptions: { mocks } });

  await screen.findByRole('heading', {
    name: 'Ilmoittautumista ei voi muokata',
  });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ renderOptions: { mocks } });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should not show notification if user is signed in and has a registration admin organization', async () => {
  const mockedUserResponse = getMockedUserResponse({
    registrationAdminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ renderOptions: { mocks } });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should not show notification if user is signed in and is substitute user', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
    registrationAdminOrganizations: [],
    isSubstituteUser: true,
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({
    props: {
      registration: fakeRegistration({ hasSubstituteUserAccess: true }),
    },
    renderOptions: { mocks },
  });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});
