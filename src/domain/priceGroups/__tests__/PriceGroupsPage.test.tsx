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
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedPriceGroupsResponse,
  mockedSortedPriceGroupsResponse,
  priceGroups,
} from '../__mocks__/priceGroupsPage';
import PriceGroupsPage from '../PriceGroupsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedPriceGroupsResponse,
  mockedSortedPriceGroupsResponse,
  mockedUserResponse,
];
const route = ROUTES.PRICE_GROUPS;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<PriceGroupsPage />, {
    mocks,
    routes,
    ...restRenderOptions,
  });

const findHeading = () => {
  return screen.findByRole('heading', { name: 'Hintaryhmät' });
};

const getElement = (
  key:
    | 'breadcrumb'
    | 'createPriceGroupButton'
    | 'searchInput'
    | 'sortByDescriptionButton'
    | 'table'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createPriceGroupButton':
      return screen.getByRole('button', { name: 'Lisää hintaryhmä' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae hintaryhmiä' });
    case 'sortByDescriptionButton':
      return screen.getByRole('button', { name: 'Kuvaus' });
    case 'table':
      return screen.getByRole('table', {
        name: 'Hintaryhmät, järjestys Kuvaus, nouseva',
      });
  }
};

test('should render price groups page', async () => {
  renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('searchInput');
  getElement('table');
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Hintaryhmien listaus. Selaa, suodata ja muokkaa Linked Eventsin hintaryhmiä.',
    expectedKeywords:
      'hintaryhmä, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Hintaryhmät - Linked Events',
  });
});

test('should open create price group page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();

  const createPriceGroupButton = getElement('createPriceGroupButton');
  await user.click(createPriceGroupButton);

  expect(history.location.pathname).toBe(
    '/fi/administration/price-groups/create'
  );
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortByIdButton = getElement('sortByDescriptionButton');
  await user.click(sortByIdButton);

  expect(history.location.search).toBe('?sort=-description');
});

it('scrolls to price group id and calls history.replace correctly (deletes priceGroupId from state)', async () => {
  const history = createMemoryHistory();
  const priceGroupId = priceGroups.data[0]?.id;
  history.push(route, { priceGroupId });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const idLink = screen.getByRole('link', { name: priceGroupId?.toString() });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(idLink).toHaveFocus());
});
