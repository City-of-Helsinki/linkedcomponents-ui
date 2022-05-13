import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
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
  mockedPlacesResponse,
  placeNames,
  places,
} from '../__mocks__/placesPage';
import PlacesPage from '../PlacesPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(storeState);

const defaultMocks = [mockedPlacesResponse, mockedUserResponse];
const route = ROUTES.PLACES;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  store = defaultStore,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<PlacesPage />, { mocks, routes, store, ...restRenderOptions });

const findElement = (key: 'title') => {
  switch (key) {
    case 'title':
      return screen.findByRole('heading', { name: 'Paikat' });
  }
};

const getElement = (
  key:
    | 'breadcrumb'
    | 'createPlaceButton'
    | 'searchInput'
    | 'sortNameButton'
    | 'table'
    | 'title'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createPlaceButton':
      return screen.getByRole('button', { name: 'Lisää paikka' });
    case 'searchInput':
      return screen.getByRole('searchbox', { name: 'Hae paikkoja' });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Paikat, järjestys Tapahtumien lukumäärä, laskeva',
      });
    case 'title':
      return screen.getByRole('heading', { name: 'Paikat' });
  }
};

test('should render keywords page', async () => {
  renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createPlaceButton');
  getElement('searchInput');
  getElement('table');
  screen.getByRole('button', { name: placeNames[0] });
});

test('should open create place page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createKeywordButton = getElement('createPlaceButton');
  await act(async () => await user.click(createKeywordButton));

  expect(history.location.pathname).toBe('/fi/admin/places/create');
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  await act(async () => await user.click(sortNameButton));

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to place row and calls history.replace correctly (deletes placeId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { placeId: places.data[0].id });

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordButton = screen.getByRole('button', { name: placeNames[0] });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {}
    )
  );

  await waitFor(() => expect(keywordButton).toHaveFocus());
});
