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
  shouldRenderListPage,
  shouldSortListPageTable,
  waitFor,
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

test('should render keywords page', async () => {
  renderComponent();

  await shouldRenderListPage({
    createButtonLabel: '',
    heading: 'Avainsanat',
    searchInputLabel: 'Hae avainsanoja',
    tableCaption: 'Avainsanat, järjestys Tapahtumien lukumäärä, laskeva',
  });
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

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await shouldSortListPageTable({
    dataTestId: 'hds-table-sorting-header-name',
    expectedSearch: '?sort=name',
    history,
  });
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
