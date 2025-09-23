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

test('should render images page', async () => {
  renderComponent();

  await shouldRenderListPage({
    createButtonLabel: 'Lisää kuva',
    heading: 'Kuvat',
    searchInputLabel: 'Hae kuvia',
    tableCaption: 'Kuvat, järjestys Viimeksi muokattu, laskeva',
  });
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
  const { history } = renderComponent();

  await findHeading();
  await shouldClickListPageCreateButton({
    createButtonLabel: 'Lisää kuva',
    expectedPathname: '/fi/administration/images/create',
    history,
  });
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await shouldSortListPageTable({
    dataTestId: 'hds-table-sorting-header-last_modified_time',
    expectedSearch: '?sort=last_modified_time',
    history,
  });
});

it('scrolls to image row and calls history.replace correctly (deletes imageId from state)', async () => {
  const history = createMemoryHistory();
  const imageId = images.data[0]?.id as string;
  history.push(route, { imageId });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const imageLink = screen.getByRole('link', { name: imageId });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(imageLink).toHaveFocus());
});
