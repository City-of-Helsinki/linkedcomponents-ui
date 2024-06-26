import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedInvalidUpdateSignupResponse,
  mockedRegistrationResponse,
  mockedUpdateNotPresentSignupResponse,
  mockedUpdatePresentSignupResponse,
  registrationId,
  signupNames,
} from '../__mocks__/attendanceListPage';
import AttendanceListPage from '../AttendanceListPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const baseMocks = [
  mockedRegistrationResponse,
  mockedUserResponse,
  mockedOrganizationAncestorsResponse,
];

const signUpName = `${signupNames[0].firstName} ${signupNames[0].lastName}`;

const route = ROUTES.ATTENDANCE_LIST.replace(':registrationId', registrationId);

const renderComponent = (
  mocks: MockedResponse[] = baseMocks,
  renderOptions?: CustomRenderOptions
) =>
  renderWithRoute(<AttendanceListPage />, {
    mocks,
    routes: [route],
    path: ROUTES.ATTENDANCE_LIST,
    ...renderOptions,
  });

const getSearchInput = () =>
  screen.getByRole('textbox', { name: 'Hae osallistujia' });

test('should show attendance list page', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  for (const { firstName, lastName } of signupNames) {
    const name = `${firstName} ${lastName}`;
    screen.getByRole('checkbox', { name });
  }
});

test('should search attendees by name', async () => {
  const user = userEvent.setup();

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  const searchInput = getSearchInput();
  await user.type(searchInput, signUpName);

  screen.getByRole('checkbox', { name: signUpName });
  for (const { firstName, lastName } of signupNames.slice(1)) {
    const name = `${firstName} ${lastName}`;
    expect(screen.queryByRole('checkbox', { name })).not.toBeInTheDocument();
  }
});

test('should show no results text', async () => {
  const user = userEvent.setup();

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  const searchInput = getSearchInput();
  await user.type(searchInput, 'Name not found');

  await screen.findByText('Ei tuloksia');
});

test('should mark signup as present', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...baseMocks,
    mockedUpdatePresentSignupResponse,
    mockedUpdateNotPresentSignupResponse,
  ]);
  await loadingSpinnerIsNotInDocument();

  const signupCheckbox = screen.getByRole('checkbox', { name: signUpName });
  await user.click(signupCheckbox);
  expect(signupCheckbox).toBeChecked();

  await user.click(signupCheckbox);
  expect(signupCheckbox).not.toBeChecked();
});

test('should show notification if updating presence status fails', async () => {
  const user = userEvent.setup();

  renderComponent([...baseMocks, mockedInvalidUpdateSignupResponse]);
  await loadingSpinnerIsNotInDocument();

  const signupCheckbox = screen.getByRole('checkbox', { name: signUpName });
  user.click(signupCheckbox);
  await screen.findByRole('alert', {
    name: 'Läsnäolotiedon päivittäminen epäonnistui',
  });
});
