import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  renderWithRoute,
  screen,
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

const findElement = (key: 'nameInput' | 'saveButton') => {
  switch (key) {
    case 'nameInput':
      return screen.findByLabelText(/nimi/i);
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

const getElement = (
  key: 'adminUsersToggleButton' | 'replacedByToggleButton'
) => {
  switch (key) {
    case 'adminUsersToggleButton':
      return screen.getByRole('combobox', { name: /^pääkäyttäjät\b/i });
    case 'replacedByToggleButton':
      return screen.getByRole('combobox', { name: /korvaava organisaatio/i });
  }
};

const fillFormValues = async (user: ReturnType<typeof userEvent.setup>) => {
  const adminUsersToggleButton = getElement('adminUsersToggleButton');
  await user.click(adminUsersToggleButton);

  const userOptionLabel = `${users.data[0]?.displayName} - ${users.data[0]?.email}`;
  const userOption = await screen.findByRole('option', {
    name: userOptionLabel,
  });
  await user.click(userOption);
  await user.keyboard('{Escape}');

  // Ensure the user is selected before proceeding.
  await user.click(adminUsersToggleButton);
  await screen.findByRole('option', {
    name: userOptionLabel,
    selected: true,
  });
  await user.keyboard('{Escape}');

  await user.click(getElement('replacedByToggleButton'));
  const organizationOption = await screen.findByRole('option', {
    name: getValue(organizations.data[0]?.name, ''),
  });
  await user.click(organizationOption);
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
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
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateOrganizationResponse,
  ]);

  const submitButton = await findElement('saveButton');

  await fillFormValues(user);

  await user.click(submitButton);

  // Wait for the notification first to ensure mutation completed
  await screen.findByRole('alert', { name: 'Organisaatio on tallennettu' });

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateOrganizationResponse]);

  const submitButton = await findElement('saveButton');

  await fillFormValues(user);

  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});

test('should patch organization merchants and accounts by financial admin', async () => {
  const user = userEvent.setup();
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
