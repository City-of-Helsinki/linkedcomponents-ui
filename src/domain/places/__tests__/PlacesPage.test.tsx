import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import PlacesPage from '../PlacesPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(storeState);

const defaultMocks = [mockedUserResponse];
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

const getElement = (key: 'breadcrumb' | 'createPlaceButton' | 'title') => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createPlaceButton':
      return screen.getByRole('button', { name: 'Lisää paikka' });
    case 'title':
      return screen.getByRole('heading', { name: 'Paikat' });
  }
};

test('should open create place page', async () => {
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createKeywordButton = getElement('createPlaceButton');
  userEvent.click(createKeywordButton);

  expect(history.location.pathname).toBe('/fi/admin/places/create');
});
