import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  CustomRenderOptions,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordNames,
  keywords,
  mockedKeywordsResponse,
} from '../__mocks__/keywordsPage';
import KeywordsPage from '../KeywordsPage';

const storeState = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(storeState);

const defaultMocks = [mockedKeywordsResponse, mockedUserResponse];
const route = ROUTES.KEYWORDS;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  store = defaultStore,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<KeywordsPage />, { mocks, routes, store, ...restRenderOptions });

const findElement = (key: 'title') => {
  switch (key) {
    case 'title':
      return screen.findByRole('heading', { name: 'Avainsanat' });
  }
};

const getElement = (
  key:
    | 'breadcrumb'
    | 'createKeywordButton'
    | 'searchInput'
    | 'sortNameButton'
    | 'table'
    | 'title'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createKeywordButton':
      return screen.getByRole('button', { name: 'Lisää avainsana' });
    case 'searchInput':
      return screen.getByRole('searchbox', { name: 'Hae avainsanoja' });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Avainsanat, järjestys Tapahtumien lukumäärä, laskeva',
      });
    case 'title':
      return screen.getByRole('heading', { name: 'Avainsanat' });
  }
};

test('should render keywords page', async () => {
  renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createKeywordButton');
  getElement('searchInput');
  getElement('table');
  screen.getByRole('button', { name: keywordNames[0] });
});

test('should open create keyword page', async () => {
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createKeywordButton = getElement('createKeywordButton');
  userEvent.click(createKeywordButton);

  expect(history.location.pathname).toBe('/fi/admin/keywords/create');
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  act(() => userEvent.click(sortNameButton));

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to keyword row and calls history.replace correctly (deletes keywordId from state)', async () => {
  const history = createMemoryHistory();
  const historyObject = {
    state: { keywordId: keywords.data[0].id },
    pathname: route,
  };
  history.push(historyObject);

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordButton = screen.getByRole('button', { name: keywordNames[0] });

  expect(replaceSpy).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: historyObject.pathname })
  );

  await waitFor(() => expect(keywordButton).toHaveFocus());
});
