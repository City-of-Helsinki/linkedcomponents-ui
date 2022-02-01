import { fakeKeywordSets } from '../../../../utils/mockDataUtils';
import { act, render, screen, userEvent } from '../../../../utils/testUtils';
import { TEST_KEYWORD_SET_ID } from '../../../keywordSet/constants';
import { keywordSetNames, keywordSets } from '../../__mocks__/keywordSetsPage';
import { KEYWORD_SET_SORT_OPTIONS } from '../../constants';
import KeywordSetsTable, { KeywordSetsTableProps } from '../KeywordSetsTable';

const defaultProps: KeywordSetsTableProps = {
  caption: 'Keyword set table',
  keywordSets: [],
  setSort: jest.fn(),
  sort: KEYWORD_SET_SORT_OPTIONS.NAME,
};

const renderComponent = (props?: Partial<KeywordSetsTableProps>) =>
  render(<KeywordSetsTable {...defaultProps} {...props} />);

test('should render keywords table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Käyttötarkoitus'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all keyword sets', () => {
  renderComponent({ keywordSets: keywordSets.data });

  // Test only first 2 to keep this test performant
  for (const name of keywordSetNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit keyword set page by clicking keyword set row', () => {
  const keywordSetName = 'Keyword set';
  const keywordSetId = TEST_KEYWORD_SET_ID;
  const { history } = renderComponent({
    keywordSets: fakeKeywordSets(1, [
      { name: { fi: keywordSetName }, id: keywordSetId },
    ]).data,
  });

  act(() =>
    userEvent.click(screen.getByRole('button', { name: keywordSetName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/keyword-sets/edit/${keywordSetId}`
  );
});

test('should open edit keyword set page by pressing enter on row', () => {
  const keywordSetName = 'Keyword set';
  const keywordSetId = TEST_KEYWORD_SET_ID;
  const { history } = renderComponent({
    keywordSets: fakeKeywordSets(1, [
      { name: { fi: keywordSetName }, id: keywordSetId },
    ]).data,
  });

  act(() =>
    userEvent.type(
      screen.getByRole('button', { name: keywordSetName }),
      '{enter}'
    )
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/keyword-sets/edit/${keywordSetId}`
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

  const usageButton = screen.getByRole('button', { name: 'Käyttötarkoitus' });
  userEvent.click(usageButton);

  expect(setSort).toBeCalledWith('usage');
});
