import React from 'react';

import { Organization } from '../../../../generated/graphql';
import {
  configure,
  render,
  screen,
  userEvent,
  within,
} from '../../../../utils/testUtils';
import { organizations } from '../../__mocks__/organizationsPage';
import { ORGANIZATION_SORT_OPTIONS } from '../../constants';
import OrganizationsTable, {
  OrganizationsTableProps,
} from '../OrganizationsTable';

configure({ defaultHidden: true });

const organizationName = organizations.data[0]?.name as string;
const organizationId = organizations.data[0]?.id as string;

const defaultProps: OrganizationsTableProps = {
  caption: 'Organizations table',
  organizations: [],
  setSort: jest.fn(),
  showSubOrganizations: true,
  sort: ORGANIZATION_SORT_OPTIONS.NAME,
  sortedOrganizations: organizations.data as Organization[],
};

const renderComponent = (props?: Partial<OrganizationsTableProps>) =>
  render(<OrganizationsTable {...defaultProps} {...props} />);

test('should render organizations table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi Järjestetty nousevaan järjestykseen',
    'ID',
    'Datalähde',
    'Luokittelu',
    'Pääorganisaatio',
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
    screen.getByRole('button', { name: name as string });
  }
});

test('should open edit organization page by clicking organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    organizations: organizations.data as Organization[],
  });

  await user.click(screen.getByRole('button', { name: organizationName }));

  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/edit/${organizationId}`
  );
});

test('should open edit organization page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    organizations: organizations.data as Organization[],
  });

  await user.type(
    screen.getByRole('button', { name: organizationName }),
    '{enter}'
  );

  expect(history.location.pathname).toBe(
    `/fi/administration/organizations/edit/${organizationId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = jest.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi Järjestetty nousevaan järjestykseen',
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

  const withinRow = within(
    screen.getByRole('button', { name: organizationName })
  );
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
