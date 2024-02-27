import { fakePriceGroups } from '../../../../utils/mockDataUtils';
import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PRICE_GROUP_ID } from '../../../priceGroup/constants';
import {
  priceGroupDescriptions,
  priceGroups,
} from '../../__mocks__/priceGroupsPage';
import { PRICE_GROUP_SORT_OPTIONS } from '../../constants';
import PriceGroupsTable, { PriceGroupsTableProps } from '../PriceGroupsTable';

const priceGroupDescription = 'Price group description';
const priceGroupId = TEST_PRICE_GROUP_ID;

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const defaultProps: PriceGroupsTableProps = {
  caption: 'Price groups table',
  priceGroups: [],
  setSort: vi.fn(),
  sort: PRICE_GROUP_SORT_OPTIONS.ID_DESC,
};

const mocks = [mockedOrganizationResponse, mockedOrganizationAncestorsResponse];

const renderComponent = (props?: Partial<PriceGroupsTableProps>) =>
  render(<PriceGroupsTable {...defaultProps} {...props} />, { mocks });

const findPriceGroupRow = async (id: number) =>
  (await screen.findByRole('link', { name: id.toString() })).parentElement
    ?.parentElement?.parentElement as HTMLElement;

test('should render price groups table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Julkaisija', 'Kuvaus', 'Ilmainen'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all price groups', () => {
  renderComponent({ priceGroups: priceGroups.data });

  // Test only first 2 to keep this test performant
  for (const description of priceGroupDescriptions.slice(0, 2)) {
    screen.getByText(description);
  }
});

test('should open edit price group page by clicking price group id', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    priceGroups: fakePriceGroups(1, [
      { description: { fi: priceGroupDescription }, id: priceGroupId },
    ]).data,
  });

  await user.click(screen.getByRole('link', { name: priceGroupId.toString() }));

  expect(history.location.pathname).toBe(
    `/fi/administration/price-groups/edit/${priceGroupId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const idButton = screen.getByRole('button', {
    name: 'ID',
  });
  await user.click(idButton);
  await waitFor(() => expect(setSort).toBeCalledWith('id'));
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    priceGroups: fakePriceGroups(1, [
      { description: { fi: priceGroupDescription }, id: priceGroupId },
    ]).data,
  });

  const withinRow = within(await findPriceGroupRow(priceGroupId));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa hintaryhmää/i,
  });
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/price-groups/edit/${priceGroupId}`
    )
  );
});
