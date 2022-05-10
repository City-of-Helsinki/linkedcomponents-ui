import { fakeKeywords } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { TEST_KEYWORD_ID } from '../../../keyword/constants';
import { keywordNames, keywords } from '../../__mocks__/keywordsPage';
import { KEYWORD_SORT_OPTIONS } from '../../constants';
import KeywordsTable, { KeywordsTableProps } from '../KeywordsTable';

configure({ defaultHidden: true });

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

test('should render all keywords', () => {
  renderComponent({ keywords: keywords.data });

  // Test only first 2 to keep this test performant
  for (const name of keywordNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit keyword page by clicking keyword', async () => {
  const keywordName = 'Keyword name';
  const keywordId = TEST_KEYWORD_ID;

  const user = userEvent.setup();
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: keywordName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/keywords/edit/${keywordId}`
  );
});

test('should open edit keyword page by pressing enter on row', async () => {
  const keywordName = 'Keyword name';
  const keywordId = TEST_KEYWORD_ID;

  const user = userEvent.setup();
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  await act(
    async () =>
      await user.type(
        screen.getByRole('button', { name: keywordName }),
        '{enter}'
      )
  );

  expect(history.location.pathname).toBe(
    `/fi/admin/keywords/edit/${keywordId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = jest.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  await act(async () => await user.click(nameButton));
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  await act(async () => await user.click(idButton));

  expect(setSort).toBeCalledWith('id');

  const nEventsButton = screen.getByRole('button', { name: 'Tapahtumien lkm' });
  await act(async () => await user.click(nEventsButton));

  expect(setSort).toBeCalledWith('n_events');
});
