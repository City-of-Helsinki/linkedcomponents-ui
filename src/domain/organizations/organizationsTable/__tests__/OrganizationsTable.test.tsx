import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { organizations } from '../../__mocks__/organizationsPage';
import { ORGANIZATION_SORT_OPTIONS } from '../../constants';
import OrganizationsTable, {
  OrganizationsTableProps,
} from '../OrganizationsTable';

configure({ defaultHidden: true });

const defaultProps: OrganizationsTableProps = {
  caption: 'Organizations table',
  organizations: [],
  setSort: jest.fn(),
  showSubOrganizations: true,
  sort: ORGANIZATION_SORT_OPTIONS.NAME,
  sortedOrganizations: organizations.data,
};

const renderComponent = (props?: Partial<OrganizationsTableProps>) =>
  render(<OrganizationsTable {...defaultProps} {...props} />);

test('should render organizations table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi',
    'ID',
    'Datalähde',
    'Luokittelu',
    'Pääorganisaatio',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all organizations', () => {
  renderComponent({ organizations: organizations.data });

  for (const { name } of organizations.data) {
    screen.getByRole('button', { name });
  }
});

test('should open edit organization page by clicking organization', async () => {
  const organizationName = organizations.data[0].name;
  const organizationId = organizations.data[0].id;
  const user = userEvent.setup();
  const { history } = renderComponent({ organizations: organizations.data });

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: organizationName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizationId}`
  );
});

test('should open edit organization page by pressing enter on row', async () => {
  const organizationName = organizations.data[0].name;
  const organizationId = organizations.data[0].id;
  const user = userEvent.setup();
  const { history } = renderComponent({ organizations: organizations.data });

  await act(
    async () =>
      await user.type(
        screen.getByRole('button', { name: organizationName }),
        '{enter}'
      )
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizationId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = jest.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  await act(async () => await user.click(nameButton));
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  await act(async () => await user.click(idButton));

  expect(setSort).toBeCalledWith('id');
});
