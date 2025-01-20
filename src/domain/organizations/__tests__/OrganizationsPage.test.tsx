import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
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
import { mockedDataSourceResponse } from '../../dataSource/__mocks__/dataSource';
import { mockedOrganizationClassResponse } from '../../organizationClass/__mocks__/organizationClass';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../__mocks__/organizationsPage';
import OrganizationsPage from '../OrganizationsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedDataSourceResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

const route = ROUTES.ORGANIZATIONS;
const routes = [route];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<OrganizationsPage />, {
    mocks,
    routes,
    ...renderOptions,
  });

const findHeading = () =>
  screen.findByRole('heading', { name: 'Organisaatiot' });

test('should render organizations page', async () => {
  renderComponent();

  await shouldRenderListPage({
    createButtonLabel: 'Lisää uusi organisaatio',
    heading: 'Organisaatiot',
    searchInputLabel: 'Hae organisaatioita',
    tableCaption: 'Organisaatiot, järjestys Nimi, nouseva',
  });
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Organisaatioiden listaus. Selaa, suodata ja muokkaa Linked Eventsin organisaatioita.',
    expectedKeywords:
      'organisaatio, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Organisaatiot - Linked Events',
  });

  await loadingSpinnerIsNotInDocument();
});

test('should open create organization page', async () => {
  const { history } = renderComponent();

  await findHeading();
  await shouldClickListPageCreateButton({
    createButtonLabel: 'Lisää uusi organisaatio',
    expectedPathname: '/fi/administration/organizations/create',
    history,
  });
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await shouldSortListPageTable({
    dataTestId: 'hds-table-sorting-header-name',
    expectedSearch: '?sort=-name',
    history,
  });
});

it('scrolls to organization row and calls history.replace correctly (deletes organizationId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { organizationId: organizations.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const organizationButton = screen.getByRole('link', {
    name: getValue(organizations.data[0]?.name, ''),
  });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(organizationButton).toHaveFocus());
});
