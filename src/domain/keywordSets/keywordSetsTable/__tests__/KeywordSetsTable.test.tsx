import getValue from '../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { keywordSetNames, keywordSets } from '../../__mocks__/keywordSetsPage';
import { KEYWORD_SET_SORT_OPTIONS } from '../../constants';
import KeywordSetsTable, { KeywordSetsTableProps } from '../KeywordSetsTable';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const keywordSetId = getValue(keywordSets.data[0]?.id, '');

const defaultProps: KeywordSetsTableProps = {
  caption: 'Keyword set table',
  keywordSets: [],
  setSort: vi.fn(),
  sort: KEYWORD_SET_SORT_OPTIONS.NAME,
};

const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = (props?: Partial<KeywordSetsTableProps>) =>
  render(<KeywordSetsTable {...defaultProps} {...props} />, { mocks });

const findKeywordSetRow = async (id: string) =>
  (await screen.findByRole('link', { name: id })).parentElement
    ?.parentElement as HTMLElement;

test('should render keywords table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Käyttötarkoitus', 'Toiminnot'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all keyword sets', async () => {
  renderComponent({ keywordSets: keywordSets.data });

  // Test only first 2 to keep this test performant
  for (const name of keywordSetNames.slice(0, 2)) {
    await screen.findByText(name);
  }
});

test('should open edit keyword set page by clicking keyword set id', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ keywordSets: [keywordSets.data[0]] });

  await user.click(
    screen.getByRole('link', { name: keywordSets.data[0]?.id as string })
  );

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keyword-sets/edit/${keywordSetId}`
    )
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();

  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi',
  });
  await user.click(nameButton);
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  await user.click(idButton);

  expect(setSort).toBeCalledWith('id');

  const usageButton = screen.getByRole('button', { name: 'Käyttötarkoitus' });
  await user.click(usageButton);

  expect(setSort).toBeCalledWith('usage');
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ keywordSets: [keywordSets.data[0]] });

  const withinRow = within(
    await findKeywordSetRow(keywordSets.data[0]?.id as string)
  );
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa avainsanaryhmää/i,
  });
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keyword-sets/edit/${keywordSetId}`
    )
  );
});
