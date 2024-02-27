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
  userEvent,
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

const getElement = (
  key:
    | 'breadcrumb'
    | 'createOrganizationButton'
    | 'searchInput'
    | 'sortNameButton'
    | 'table'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createOrganizationButton':
      return screen.getByRole('button', { name: 'Lisää uusi organisaatio' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae organisaatioita' });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Organisaatiot, järjestys Nimi, nouseva',
      });
  }
};

test('should render organizations page', async () => {
  renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createOrganizationButton');
  getElement('searchInput');
  getElement('table');
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
});

test('should open create organization page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findHeading();
  await loadingSpinnerIsNotInDocument();

  const createOrganizationButton = getElement('createOrganizationButton');
  await user.click(createOrganizationButton);

  expect(history.location.pathname).toBe(
    '/fi/administration/organizations/create'
  );
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  await user.click(sortNameButton);

  expect(history.location.search).toBe('?sort=-name');
});

it('scrolls to organization row and calls history.replace correctly (deletes organizationId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { organizationId: organizations.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const organizationButton = screen.getByRole('button', {
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
