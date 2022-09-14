import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../../utils/mockAuthContextValue';
import { configure, render, screen } from '../../../../../utils/testUtils';
import {
  dataSourceName,
  mockedDataSourceResponse,
} from '../../../../dataSource/__mocks__/dataSource';
import { organization } from '../../../../organization/__mocks__/organization';
import {
  mockedOrganizationClassResponse,
  organizationClassName,
} from '../../../../organizationClass/__mocks__/organizationClass';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import OrganizationsTableRow, {
  OrganizationsTableRowProps,
} from '../OrganizationsTableRow';

configure({ defaultHidden: true });

const defaultProps: OrganizationsTableRowProps = {
  organization,
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [
  mockedDataSourceResponse,
  mockedOrganizationClassResponse,
  mockedUserResponse,
];

const renderComponent = () =>
  render(
    <table>
      <tbody>
        <OrganizationsTableRow {...defaultProps} />
      </tbody>
    </table>,
    { authContextValue, mocks }
  );

test('should render organizations table row', async () => {
  renderComponent();

  screen.getByRole('link', { name: organization.name as string });
  screen.getByText(organization.id as string);
  await screen.findByText(dataSourceName);
  await screen.findByText(organizationClassName);
});
