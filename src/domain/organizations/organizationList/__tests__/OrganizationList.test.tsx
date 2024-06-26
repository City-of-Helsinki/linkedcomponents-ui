import { ROUTES } from '../../../../constants';
import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  fireEvent,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedDataSourceResponse } from '../../../dataSource/__mocks__/dataSource';
import { mockedOrganizationClassResponse } from '../../../organizationClass/__mocks__/organizationClass';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../__mocks__/organizationsPage';
import OrganizationList from '../OrganizationList';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const mocks = [
  mockedDataSourceResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationsResponse,
];

const route = ROUTES.ORGANIZATIONS;

const renderComponent = () =>
  renderWithRoute(<OrganizationList />, {
    mocks,
    routes: [route],
    path: ROUTES.ORGANIZATIONS,
  });

const getElement = (key: 'searchButton' | 'searchInput') => {
  switch (key) {
    case 'searchButton':
      return screen.getByRole('button', { name: /etsi/i });
    case 'searchInput':
      return screen.getByRole('textbox', { name: /hae organisaatioita/i });
  }
};

test('should search by text', async () => {
  const searchValue = organizations.data[0]?.name as string;
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  screen.getByRole('link', {
    name: organizations.data[0]?.name as string,
  });
  screen.getByRole('link', {
    name: organizations.data[2]?.name as string,
  });
  await waitFor(() => expect(history.location.search).toBe(''));

  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: searchValue } });
  await user.click(getElement('searchButton'));

  await waitFor(() =>
    expect(history.location.search).toBe(
      `?text=${searchValue.replace(/\s/g, '+')}`
    )
  );

  await waitFor(() =>
    expect(
      screen.queryByRole('link', {
        name: organizations.data[2]?.name as string,
      })
    ).not.toBeInTheDocument()
  );
  screen.getByRole('link', {
    name: organizations.data[0]?.name as string,
  });
});

test('should show sub events', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const showMoreButton = screen.getByRole('button', {
    name: `Näytä alaorganisaatiot: ${organizations.data[0]?.name}`,
  });
  await user.click(showMoreButton);

  // Should show sub-organization
  await screen.findByRole('link', {
    name: organizations.data[1]?.name as string,
  });

  const hideButton = screen.getByRole('button', {
    name: `Piilota alaorganisaatiot: ${organizations.data[0]?.name}`,
  });
  await user.click(hideButton);

  // Sub-organization should be hidden
  expect(
    screen.queryByRole('link', {
      name: organizations.data[1]?.name as string,
    })
  ).not.toBeInTheDocument();
});
