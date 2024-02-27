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
  imageNames,
  images,
  mockedImagesResponse,
  mockedSortedImagesResponse,
} from '../__mocks__/imagesPage';
import ImagesPage from '../ImagesPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedImagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedSortedImagesResponse,
  mockedUserResponse,
];

const route = ROUTES.KEYWORDS;
const routes = [route];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<ImagesPage />, {
    mocks,
    routes,
    ...renderOptions,
  });

const findHeading = () => screen.findByRole('heading', { name: 'Kuvat' });

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
      return screen.getByRole('combobox', { name: 'Hae kuvia' });
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

  await findHeading();
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createImageButton');
  getElement('searchInput');
  getElement('table');
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Kuvien listaus. Selaa, suodata ja muokkaa Linked Events -kuvia.',
    expectedKeywords:
      'kuva, lista, selailla, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Kuvat - Linked Events',
  });
});

test('should open create image page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();

  const createImageButton = getElement('createImageButton');
  await user.click(createImageButton);

  expect(history.location.pathname).toBe('/fi/administration/images/create');
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortLastModifiedButton = getElement('sortLastModifiedButton');
  await user.click(sortLastModifiedButton);

  expect(history.location.search).toBe('?sort=last_modified_time');
});

it('scrolls to image row and calls history.replace correctly (deletes imageId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { imageId: images.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const imageButton = screen.getByRole('button', { name: imageNames[0] });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(imageButton).toHaveFocus());
});
