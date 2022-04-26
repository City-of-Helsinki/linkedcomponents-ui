import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore, render, screen } from '../../../../utils/testUtils';
import {
  dataSourceName,
  mockedDataSourcesResponse,
} from '../../../dataSource/__mocks__/dataSource';
import { organization } from '../../../organization/__mocks__/organization';
import {
  mockedOrganizationClassesResponse,
  organizationClassName,
} from '../../../organizationClass/__mocks__/organizationClass';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import OrganizationsTableRow, {
  OrganizationsTableRowProps,
} from '../OrganizationsTableRow';

const defaultProps: OrganizationsTableRowProps = {
  organization,
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const mocks = [
  mockedDataSourcesResponse,
  mockedOrganizationClassesResponse,
  mockedUserResponse,
];

const renderComponent = () =>
  render(
    <table>
      <tbody>
        <OrganizationsTableRow {...defaultProps} />
      </tbody>
    </table>,
    { mocks, store }
  );

test('should render organizations table row', async () => {
  renderComponent();

  screen.getByRole('link', { name: organization.name });
  screen.getByText(organization.id);
  await screen.findByText(dataSourceName);
  await screen.findByText(organizationClassName);
});
