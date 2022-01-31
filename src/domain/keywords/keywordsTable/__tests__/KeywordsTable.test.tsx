import { fakeKeywords } from '../../../../utils/mockDataUtils';
import { act, render, screen, userEvent } from '../../../../utils/testUtils';
import { TEST_KEYWORD_ID } from '../../../keyword/constants';
import { keywordNames, keywords } from '../../__mocks__/keywordsPage';
import { KEYWORD_SORT_OPTIONS } from '../../constants';
import KeywordsTable, { KeywordsTableProps } from '../KeywordsTable';

const defaultProps: KeywordsTableProps = {
  caption: 'Keywords table',
  keywords: [],
  setSort: jest.fn(),
  sort: KEYWORD_SORT_OPTIONS.NAME,
};

const renderComponent = (props?: Partial<KeywordsTableProps>) =>
  render(<KeywordsTable {...defaultProps} {...props} />);

test('should render keywords table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Tapahtumien lkm'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all events', () => {
  renderComponent({ keywords: keywords.data });

  // Test only first 2 to keep this test performant
  for (const name of keywordNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit keyword page by clicking keyword', () => {
  const keywordName = 'Keyword name';
  const keywordId = TEST_KEYWORD_ID;
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  act(() => userEvent.click(screen.getByRole('button', { name: keywordName })));

  expect(history.location.pathname).toBe(
    `/fi/admin/keywords/edit/${keywordId}`
  );
});

test('should open edit keyword page by pressing enter on row', () => {
  const keywordName = 'Keyword name';
  const keywordId = TEST_KEYWORD_ID;
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  act(() =>
    userEvent.type(screen.getByRole('button', { name: keywordName }), '{enter}')
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/keywords/edit/${keywordId}`
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

  const nEventsButton = screen.getByRole('button', { name: 'Tapahtumien lkm' });
  userEvent.click(nEventsButton);

  expect(setSort).toBeCalledWith('n_events');
});
