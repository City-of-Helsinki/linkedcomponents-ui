import { Organization } from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  within,
} from '../../../../utils/testUtils';
import { mockedDataSourceResponse } from '../../../dataSource/__mocks__/dataSource';
import { mockedOrganizationClassResponse } from '../../../organizationClass/__mocks__/organizationClass';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { organizations } from '../../__mocks__/organizationsPage';
import { ORGANIZATION_SORT_OPTIONS } from '../../constants';
import OrganizationsTable, {
  OrganizationsTableProps,
} from '../OrganizationsTable';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const organizationName = getValue(organizations.data[0]?.name, '');
const organizationId = getValue(organizations.data[0]?.id, '');

const defaultProps: OrganizationsTableProps = {
  caption: 'Organizations table',
  organizations: [],
  setSort: vi.fn(),
  showSubOrganizations: true,
  sort: ORGANIZATION_SORT_OPTIONS.NAME,
  sortedOrganizations: organizations.data as Organization[],
};

const mocks = [
  mockedDataSourceResponse,
  mockedOrganizationClassResponse,
  mockedUserResponse,
];

const renderComponent = (props?: Partial<OrganizationsTableProps>) =>
  render(<OrganizationsTable {...defaultProps} {...props} />, { mocks });

const findOrganizationRow = async (name: string) =>
  (await screen.findByRole('link', { name })).parentElement?.parentElement
    ?.parentElement?.parentElement as HTMLElement;

test('should render organizations table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi',
    'ID',
    'Datalähde',
    'Luokittelu',
    'Pääorganisaatio',
    'Toiminnot',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all organizations', () => {
  const organizationItems = organizations.data as Organization[];
  renderComponent({ organizations: organizationItems });

  for (const { name } of organizationItems) {
    screen.getByRole('link', { name: getValue(name, '') });
  }
});

test('should open edit organization page by clicking organization name', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    organizations: organizations.data as Organization[],
  });

  await user.click(screen.getByRole('link', { name: organizationName }));

  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/edit/${organizationId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi',
  });
  await user.click(nameButton);
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  await user.click(idButton);

  expect(setSort).toBeCalledWith('id');
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    organizations: organizations.data as Organization[],
  });

  const withinRow = within(await findOrganizationRow(organizationName));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa organisaatiota/i,
  });

  await user.click(editButton);

  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/edit/${organizationId}`
  );
});
