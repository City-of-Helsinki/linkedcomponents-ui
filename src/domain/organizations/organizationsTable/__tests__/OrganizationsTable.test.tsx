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

test('should open edit organization page by clicking organization', () => {
  const organizationName = organizations.data[0].name;
  const organizationId = organizations.data[0].id;
  const { history } = renderComponent({ organizations: organizations.data });

  act(() =>
    userEvent.click(screen.getByRole('button', { name: organizationName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizationId}`
  );
});

test('should open edit organization page by pressing enter on row', () => {
  const organizationName = organizations.data[0].name;
  const organizationId = organizations.data[0].id;
  const { history } = renderComponent({ organizations: organizations.data });

  act(() =>
    userEvent.type(
      screen.getByRole('button', { name: organizationName }),
      '{enter}'
    )
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/organizations/edit/${organizationId}`
  );
});

test('should call setSort when clicking sortable column header', () => {
  const setSort = jest.fn();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  act(() => userEvent.click(nameButton));
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  userEvent.click(idButton);

  expect(setSort).toBeCalledWith('id');
});
