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
  keywordSets,
  mockedKeywordSetsResponse,
  mockedSortedKeywordSetsResponse,
} from '../__mocks__/keywordSetsPage';
import KeywordSetsPage from '../KeywordSetsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedKeywordSetsResponse,
  mockedOrganizationAncestorsResponse,
  mockedSortedKeywordSetsResponse,
  mockedUserResponse,
];

const route = ROUTES.KEYWORD_SETS;
const routes = [route];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<KeywordSetsPage />, {
    mocks,
    routes,
    ...renderOptions,
  });

test('should render keyword sets page', async () => {
  renderComponent();

  await shouldRenderListPage({
    createButtonLabel: '',
    heading: 'Avainsanaryhmät',
    searchInputLabel: 'Hae avainsanaryhmiä',
    tableCaption: 'Avainsanaryhmät, järjestys Id, nouseva',
  });
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Avainsanaryhmien listaus. Selaa, suodata ja muokkaa Linked Eventsin avainsanaryhmiä.',
    expectedKeywords:
      'avainsana, ryhmä, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Avainsanaryhmät - Linked Events',
  });
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await shouldSortListPageTable({
    columnHeader: 'Nimi',
    expectedSearch: '?sort=name',
    history,
  });
});

it('scrolls to keyword set id and calls history.replace correctly (deletes keywordSetId from state)', async () => {
  const history = createMemoryHistory();
  const keywordSetId = keywordSets.data[0]?.id as string;
  history.push(route, { keywordSetId });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordSetButton = screen.getByRole('link', { name: keywordSetId });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(keywordSetButton).toHaveFocus(), {
    timeout: 5000,
  });
});
