import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordNames,
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

const findHeading = () => screen.findByRole('heading', { name: 'Avainsanat' });

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

  await findHeading();
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createKeywordButton');
  getElement('searchInput');
  getElement('table');
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Avainsanojen listaus. Selaa, suodata ja muokkaa Linked Eventsin avainsanoja.',
    expectedKeywords:
      'avainsana, lista, selailla, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Avainsanat - Linked Events',
  });
});

test('should open create keyword page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findHeading();
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
  history.push(route, { keywordId: keywords.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordButton = screen.getByRole('button', { name: keywordNames[0] });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(keywordButton).toHaveFocus());
});
