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
  mockedOrganizationsResponse,
  organizations,
} from '../__mocks__/organizationsPage';
import OrganizationsPage from '../OrganizationsPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(storeState);

const defaultMocks = [mockedOrganizationsResponse, mockedUserResponse];

const route = ROUTES.ORGANIZATIONS;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  store = defaultStore,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<OrganizationsPage />, { mocks, routes, store, ...restRenderOptions });

const findElement = (key: 'title') => {
  switch (key) {
    case 'title':
      return screen.findByRole('heading', { name: 'Organisaatiot' });
  }
};

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
      return screen.getByRole('searchbox', { name: 'Hae organisaatioita' });
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

  await findElement('title');
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createOrganizationButton');
  getElement('searchInput');
  getElement('table');
  screen.getByRole('button', { name: organizations.data[0].name });
});

test('should open create organization page', async () => {
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createOrganizationButton = getElement('createOrganizationButton');
  userEvent.click(createOrganizationButton);

  expect(history.location.pathname).toBe('/fi/admin/organizations/create');
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  act(() => userEvent.click(sortNameButton));

  expect(history.location.search).toBe('?sort=-name');
});

it('scrolls to organization row and calls history.replace correctly (deletes organizationId from state)', async () => {
  const history = createMemoryHistory();
  const historyObject = {
    state: { organizationId: organizations.data[0].id },
    pathname: route,
  };
  history.push(historyObject);

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const organizationButton = screen.getByRole('button', {
    name: organizations.data[0].name,
  });

  expect(replaceSpy).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: historyObject.pathname })
  );

  await waitFor(() => expect(organizationButton).toHaveFocus());
});
