import getValue from '../../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: OrganizationsTableRowProps = {
  organization,
};

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
    { mocks }
  );

test('should render organizations table row', async () => {
  renderComponent();

  screen.getByRole('link', { name: getValue(organization.name, '') });
  screen.getByText(getValue(organization.id, ''));
  await screen.findByText(dataSourceName);
  await screen.findByText(organizationClassName);
});
