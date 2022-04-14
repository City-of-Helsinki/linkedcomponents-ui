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
  imageNames,
  images,
  mockedImagesResponse,
} from '../__mocks__/imagesPage';
import ImagesPage from '../ImagesPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(storeState);

const defaultMocks = [mockedImagesResponse, mockedUserResponse];
const route = ROUTES.KEYWORDS;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  store = defaultStore,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<ImagesPage />, { mocks, routes, store, ...restRenderOptions });

const findElement = (key: 'title') => {
  switch (key) {
    case 'title':
      return screen.findByRole('heading', { name: 'Kuvat' });
  }
};

const getElement = (
  key:
    | 'breadcrumb'
    | 'createImageButton'
    | 'searchInput'
    | 'sortLastModifiedButton'
    | 'table'
    | 'title'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createImageButton':
      return screen.getByRole('button', { name: 'Lisää kuva' });
    case 'searchInput':
      return screen.getByRole('searchbox', { name: 'Hae kuvia' });
    case 'sortLastModifiedButton':
      return screen.getByRole('button', { name: /viimeksi muokattu/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Kuvat, järjestys Viimeksi muokattu, laskeva',
      });
    case 'title':
      return screen.getByRole('heading', { name: 'Kuvat' });
  }
};

test('should render images page', async () => {
  renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createImageButton');
  getElement('searchInput');
  getElement('table');
  screen.getByRole('button', { name: imageNames[0] });
});

test('should open create image page', async () => {
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createImageButton = getElement('createImageButton');
  userEvent.click(createImageButton);

  expect(history.location.pathname).toBe('/fi/admin/images/create');
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortLastModifiedButton = getElement('sortLastModifiedButton');
  act(() => userEvent.click(sortLastModifiedButton));

  expect(history.location.search).toBe('?sort=last_modified_time');
});

it('scrolls to image row and calls history.replace correctly (deletes imageId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { imageId: images.data[0].id });

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const imageButton = screen.getByRole('button', { name: imageNames[0] });

  expect(replaceSpy).toHaveBeenCalledWith(
    { hash: '', pathname: route, search: '' },
    {}
  );

  await waitFor(() => expect(imageButton).toHaveFocus());
});
