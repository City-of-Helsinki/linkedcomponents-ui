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
  return screen.findByRole('heading', { name: 'Asiakasryhmät' });
};

const getElement = (
  key: 'breadcrumb' | 'searchInput' | 'sortByDescriptionButton' | 'table'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae asiakasryhmiä' });
    case 'sortByDescriptionButton':
      return screen.getByRole('button', { name: 'Kuvaus' });
    case 'table':
      return screen.getByRole('table', {
        name: 'Asiakasryhmät, järjestys Kuvaus, nouseva',
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
      'Asiakasryhmien listaus. Selaa, suodata ja muokkaa Linked Eventsin asiakasryhmiä.',
    expectedKeywords:
      'asiakasryhmä, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Asiakasryhmät - Linked Events',
  });
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortByDescriptionButton = getElement('sortByDescriptionButton');
  await user.click(sortByDescriptionButton);

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
