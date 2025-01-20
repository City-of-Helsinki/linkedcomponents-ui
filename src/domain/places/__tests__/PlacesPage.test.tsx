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
  shouldClickListPageCreateButton,
  shouldRenderListPage,
  shouldSortListPageTable,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  places,
} from '../__mocks__/placesPage';
import PlacesPage from '../PlacesPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationAncestorsResponse,
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  mockedUserResponse,
];
const route = ROUTES.PLACES;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<PlacesPage />, {
    mocks,
    routes,
    ...restRenderOptions,
  });

const findHeading = () => screen.findByRole('heading', { name: 'Paikat' });

test('should render places page', async () => {
  renderComponent();

  await shouldRenderListPage({
    createButtonLabel: 'Lisää paikka',
    heading: 'Paikat',
    searchInputLabel: 'Hae paikkoja',
    tableCaption: 'Paikat, järjestys Tapahtumien lukumäärä, laskeva',
  });
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Paikkojen listaus. Selaa, suodata ja muokkaa Linked Eventsin paikkoja.',
    expectedKeywords:
      'paikka, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Paikat - Linked Events',
  });
});

test('should open create place page', async () => {
  const { history } = renderComponent();

  await findHeading();
  await shouldClickListPageCreateButton({
    createButtonLabel: 'Lisää paikka',
    expectedPathname: '/fi/administration/places/create',
    history,
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

it('scrolls to place row and calls history.replace correctly (deletes placeId from state)', async () => {
  const history = createMemoryHistory();
  const placeId = places.data[0]?.id as string;
  history.push(route, { placeId });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const placeLink = screen.getByRole('link', { name: placeId });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(placeLink).toHaveFocus());
});
