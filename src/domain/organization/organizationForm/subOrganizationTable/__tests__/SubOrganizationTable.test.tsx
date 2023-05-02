import React from 'react';

import getValue from '../../../../../utils/getValue';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../../organizations/__mocks__/organizationsPage';
import SubOrganizationTable, {
  SubOrganizationTableProps,
} from '../SubOrganizationTable';

configure({ defaultHidden: true });

const props: SubOrganizationTableProps = {
  organizationIds: [getValue(organizations.data[0]?.atId, '')],
  title: 'Aliorganisaatiot',
};

const mocks = [mockedOrganizationsResponse];

const renderComponent = () =>
  render(<SubOrganizationTable {...props} />, { mocks });

test('should sort sub organizations', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameColumn = await screen.findByRole('button', { name: /nimi/i });

  await user.click(nameColumn);
  screen.getByRole('table', {
    name: `${props.title}, järjestys Nimi, laskeva`,
  });
});

test('should open sub organization edit page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  screen.getByRole('heading', { name: props.title });
  screen.getByRole('table', {
    name: `${props.title}, järjestys Nimi, nouseva`,
  });

  const organizationButton = await screen.findByRole('button', {
    name: getValue(organizations.data[0]?.name, ''),
  });
  await user.click(organizationButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/organizations/edit/${organizations.data[0]?.id}`
    )
  );
});

test('should open sub organization edit page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const organizationButton = await screen.findByRole('button', {
    name: getValue(organizations.data[0]?.name, ''),
  });
  await user.type(organizationButton, '{enter}');

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/organizations/edit/${organizations.data[0]?.id}`
    )
  );
});
