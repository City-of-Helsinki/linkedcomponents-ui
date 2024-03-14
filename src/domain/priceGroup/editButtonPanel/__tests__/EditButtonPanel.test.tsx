import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedFinancialAdminUserResponse } from '../../../user/__mocks__/user';
import { priceGroup } from '../../__mocks__/editPriceGoupPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedFinancialAdminUserResponse,
];

const defaultProps: EditButtonPanelProps = {
  id: priceGroup.id.toString(),
  onSave: vi.fn(),
  publisher: TEST_PUBLISHER_ID,
  saving: null,
};

const route = `/fi/${ROUTES.EDIT_PLACE.replace(
  ':id',
  priceGroup.id.toString()
)}`;

const renderComponent = (props?: Partial<EditButtonPanelProps>) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const findSaveButton = () => screen.findByRole('button', { name: 'Tallenna' });
const getBackButton = () => screen.getByRole('button', { name: 'Takaisin' });

test('should route to price groups page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getBackButton());

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/price-groups`)
  );
});

test('should call onSave', async () => {
  const onSave = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onSave });

  const saveButton = await findSaveButton();
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onSave).toBeCalled();
});
