import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywords,
  mockedKeywordsResponse,
  mockedSortedKeywordsResponse,
} from '../__mocks__/keywordsPage';
import KeywordsPage from '../KeywordsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedKeywordsResponse,
  mockedOrganizationAncestorsResponse,
  mockedSortedKeywordsResponse,
  mockedUserResponse,
];

const route = ROUTES.KEYWORDS;
const routes = [route];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<KeywordsPage />, {
    mocks,
    routes,
    ...renderOptions,
  });

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
      return screen.getByRole('combobox', { name: 'Hae avainsanoja' });
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
});

test('applies expected metadata', async () => {
  const pageTitle = 'Avainsanat - Linked Events';
  const pageDescription =
    'Avainsanojen listaus. Selaa, suodata ja muokkaa Linked Eventsin avainsanoja.';
  const pageKeywords =
    'avainsana, lista, selailla, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should open create keyword page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createKeywordButton = getElement('createKeywordButton');
  await user.click(createKeywordButton);

  expect(history.location.pathname).toBe('/fi/administration/keywords/create');
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  await user.click(sortNameButton);

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to keyword row and calls history.replace correctly (deletes keywordId from state)', async () => {
  const history = createMemoryHistory();
  const keywordId = keywords.data[0]?.id as string;
  history.push(route, { keywordId });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordLink = screen.getByRole('link', { name: keywordId });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(keywordLink).toHaveFocus());
});
