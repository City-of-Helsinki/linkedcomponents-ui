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
  keywordSetNames,
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

const findHeading = () =>
  screen.findByRole('heading', { name: 'Avainsanaryhmät' });

const getElement = (
  key:
    | 'breadcrumb'
    | 'createKeywordSetButton'
    | 'searchInput'
    | 'sortNameButton'
    | 'table'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createKeywordSetButton':
      return screen.getByRole('button', { name: 'Lisää avainsanaryhmä' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae avainsanaryhmiä' });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Avainsanaryhmät, järjestys Id, nouseva',
      });
  }
};

test('should render keyword sets page', async () => {
  renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createKeywordSetButton');
  getElement('searchInput');
  getElement('table');
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

test('should open create keyword set page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();

  const createKeywordSetButton = getElement('createKeywordSetButton');
  await user.click(createKeywordSetButton);

  expect(history.location.pathname).toBe(
    '/fi/administration/keyword-sets/create'
  );
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  await user.click(sortNameButton);

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to keyword row and calls history.replace correctly (deletes keywordSetId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { keywordSetId: keywordSets.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordSetButton = screen.getByRole('button', {
    name: keywordSetNames[0],
  });

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
