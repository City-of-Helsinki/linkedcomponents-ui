import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
} from '../../../organizationClass/__mocks__/organizationClass';
import { mockedOrganizationsResponse } from '../../../organizations/__mocks__/organizationsPage';
import {
  mockedSuperuserResponse,
  mockedUserResponse,
  mockedUsersResponse,
} from '../../../user/__mocks__/user';
import OrganizationForm from '../OrganizationForm';

const defaultMocks = [
  mockedOrganizationsResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedSuperuserResponse,
  mockedUsersResponse,
];

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const renderComponent = () =>
  render(<OrganizationForm />, { mocks: defaultMocks });

const shouldAddAndRemoveItem = async ({
  addButtonLabel,
  deleteButtonLabel,
  expectedInputLabel,
}: {
  addButtonLabel: string;
  deleteButtonLabel: string;
  expectedInputLabel: string;
}) => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: addButtonLabel }));

  expect(
    screen.getByRole('textbox', { name: expectedInputLabel })
  ).toBeInTheDocument();
  // Allow multiple merchants or accounts
  expect(
    screen.getByRole('button', { name: addButtonLabel })
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: deleteButtonLabel }));
  expect(
    screen.queryByRole('textbox', { name: expectedInputLabel })
  ).not.toBeInTheDocument();
};

test('should add and remove account', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await shouldAddAndRemoveItem({
    addButtonLabel: 'Lisää uusi tili',
    deleteButtonLabel: 'Poista tili',
    expectedInputLabel: 'SAP-yritystunnus *',
  });
});

test('should add and remove merchant', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await shouldAddAndRemoveItem({
    addButtonLabel: 'Lisää uusi kauppias',
    deleteButtonLabel: 'Poista kauppias',
    expectedInputLabel: 'Paytrail-kauppiastunnus *',
  });
});

test('superuser can edit users', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('combobox', { name: 'Pääkäyttäjät' })
  ).not.toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Ilmoittautumisen pääkäyttäjät' })
  ).not.toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Taloushallinnon pääkäyttäjät' })
  ).not.toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Peruskäyttäjät' })
  ).not.toBeDisabled();
});

test('normal user cant edit users', async () => {
  const adminMocks = [
    mockedOrganizationsResponse,
    mockedOrganizationClassResponse,
    mockedOrganizationClassesResponse,
    mockedUserResponse,
    mockedUsersResponse,
  ];

  render(<OrganizationForm />, { mocks: adminMocks });
  await loadingSpinnerIsNotInDocument();

  expect(screen.getByRole('combobox', { name: 'Pääkäyttäjät' })).toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Ilmoittautumisen pääkäyttäjät' })
  ).toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Taloushallinnon pääkäyttäjät' })
  ).toBeDisabled();
  expect(
    screen.getByRole('combobox', { name: 'Peruskäyttäjät' })
  ).toBeDisabled();
});
