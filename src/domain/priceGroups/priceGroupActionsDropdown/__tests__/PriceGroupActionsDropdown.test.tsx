import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  CustomRenderOptions,
  openDropdownMenu,
  render,
  screen,
  shouldToggleDropdownMenu,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  mockedDeletePriceGroupResponse,
  priceGroup,
} from '../../../priceGroup/__mocks__/editPriceGoupPage';
import { mockedFinancialAdminUserResponse } from '../../../user/__mocks__/user';
import PriceGroupActionsDropdown, {
  PriceGroupActionsDropdownProps,
} from '../PriceGroupActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: PriceGroupActionsDropdownProps = {
  priceGroup,
};

const route = `/fi${ROUTES.PRICE_GROUPS}`;

const defaultMocks = [
  mockedDeletePriceGroupResponse,
  mockedOrganizationAncestorsResponse,
  mockedFinancialAdminUserResponse,
];

const renderComponent = (
  props?: Partial<PriceGroupActionsDropdownProps>,
  { mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<PriceGroupActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const getDeleteButton = () =>
  screen.getByRole('button', { name: /poista asiakasryhmä/i });

const getEditButton = () => screen.getByRole('button', { name: /muokkaa/i });

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openDropdownMenu();

  const enabledButtons = [getDeleteButton(), getEditButton()];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit price group page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getEditButton();
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/price-groups/edit/${priceGroup.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete price group', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = getDeleteButton();
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deletePriceGroupButton = withinModal.getByRole('button', {
    name: /Poista asiakasryhmä/i,
  });
  await user.click(deletePriceGroupButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Asiakasryhmä on poistettu' });
});
