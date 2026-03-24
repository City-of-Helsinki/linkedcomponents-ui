import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  renderWithRoute,
  screen,
  setupUser,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  mockedOrganizationWithFinanfialInfoResponse,
  organizationId,
} from '../../organization/__mocks__/organization';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
} from '../../organizationClass/__mocks__/organizationClass';
import {
  generateOrganizationsResponse,
  mockedOrganizationsResponse,
  organizations,
} from '../../organizations/__mocks__/organizationsPage';
import {
  mockedFinancialAdminUserResponse,
  mockedSuperuserResponse,
  mockedUsersResponse,
  users,
} from '../../user/__mocks__/user';
import {
  mockedDeleteOrganizationResponse,
  mockedInvalidUpdateOrganizationResponse,
  mockedPatchOrganizationWithFinanfialInfoResponse,
  mockedUpdateOrganizationResponse,
} from '../__mocks__/editOrganizationPage';
import EditOrganizationPage from '../EditOrganizationPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  generateOrganizationsResponse({
    overrideVariables: { child: organizationId },
  }),
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedSuperuserResponse,
  mockedUsersResponse,
];

const route = ROUTES.EDIT_ORGANIZATION.replace(':id', organizationId);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditOrganizationPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_ORGANIZATION,
  });

const findElement = (
  key:
    | 'adminUsersToggleButton'
    | 'nameInput'
    | 'replacedByToggleButton'
    | 'saveButton'
) => {
  switch (key) {
    case 'adminUsersToggleButton':
      return screen.findByRole('combobox', { name: /^pääkäyttäjät\b/i });
    case 'nameInput':
      return screen.findByLabelText(/nimi/i);
    case 'replacedByToggleButton':
      return screen.findByRole('combobox', { name: /korvaava organisaatio/i });
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

const fillFormValues = async (user: ReturnType<typeof userEvent.setup>) => {
  // Select admin user
  const adminUsersToggleButton = await findElement('adminUsersToggleButton');
  await waitFor(() => expect(adminUsersToggleButton).toBeEnabled());
  await user.click(adminUsersToggleButton);

  const userOptionLabel = `${users.data[0]?.displayName} - ${users.data[0]?.email}`;
  const userOption = await screen.findByRole('option', {
    name: userOptionLabel,
  });
  await user.click(userOption);
  await user.keyboard('{Escape}');

  // Select replaced by organization
  const replacedByToggleButton = await findElement('replacedByToggleButton');
  await waitFor(() => expect(replacedByToggleButton).toBeEnabled());
  await user.click(replacedByToggleButton);

  const organizationOptionLabel = getValue(organizations.data[0]?.name, '');
  const organizationOption = await screen.findByRole('option', {
    name: organizationOptionLabel,
  });
  await user.click(organizationOption);
  await user.keyboard('{Escape}');
};

test('should scroll to first validation error input field', async () => {
  const user = setupUser();
  renderComponent();

  const nameInput = await findElement('nameInput');
  const saveButton = await findElement('saveButton');

  await user.clear(nameInput);
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete organization', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteOrganizationResponse,
  ]);

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista organisaatio',
    deleteButtonLabel: 'Poista organisaatio',
    expectedNotificationText: 'Organisaatio on poistettu',
    expectedUrl: `/fi/administration/organizations`,
    history,
  });
});

test('should update organization', async () => {
  const user = setupUser();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateOrganizationResponse,
  ]);

  await fillFormValues(user);

  const submitButton = await findElement('saveButton');

  await user.click(submitButton);

  // Wait for the notification first to ensure mutation completed
  await screen.findByRole('alert', { name: 'Organisaatio on tallennettu' });

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should show server errors', async () => {
  const user = setupUser();
  renderComponent([...defaultMocks, mockedInvalidUpdateOrganizationResponse]);

  await fillFormValues(user);

  const submitButton = await findElement('saveButton');

  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('should patch organization merchants and accounts by financial admin', async () => {
  const user = setupUser();
  const { history } = renderComponent([
    mockedOrganizationWithFinanfialInfoResponse,
    mockedOrganizationsResponse,
    generateOrganizationsResponse({
      overrideVariables: { child: organizationId },
    }),
    mockedOrganizationClassResponse,
    mockedOrganizationClassesResponse,
    mockedFinancialAdminUserResponse,
    mockedUsersResponse,
    mockedPatchOrganizationWithFinanfialInfoResponse,
  ]);

  const submitButton = await findElement('saveButton');

  await user.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
  await screen.findByRole('alert', { name: 'Organisaatio on tallennettu' });
});
