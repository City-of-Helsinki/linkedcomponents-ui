import { ROUTES } from '../../../../constants';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../__mocks__/organizationsPage';
import OrganizationList from '../OrganizationList';

configure({ defaultHidden: true });

const mocks = [mockedOrganizationsResponse];
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
      return screen.getByRole('searchbox', { name: /hae organisaatioita/i });
  }
};

test('should search by text', async () => {
  const searchValue = organizations.data[0].name;
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  screen.getByRole('button', { name: organizations.data[0].name });
  screen.getByRole('button', { name: organizations.data[2].name });
  await waitFor(() => expect(history.location.search).toBe(''));

  await act(
    async () => await user.type(getElement('searchInput'), searchValue)
  );
  await act(async () => await user.click(getElement('searchButton')));

  await waitFor(() =>
    expect(history.location.search).toBe(
      `?text=${searchValue.replace(/\s/g, '+')}`
    )
  );

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: organizations.data[2].name })
    ).not.toBeInTheDocument()
  );
  screen.getByRole('button', { name: organizations.data[0].name });
});

test('should show sub events', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const showMoreButton = screen.getByRole('button', {
    name: `Näytä alaorganisaatiot: ${organizations.data[0].name}`,
  });
  await act(async () => await user.click(showMoreButton));

  // Should show sub-organization
  await screen.findByRole('button', { name: organizations.data[1].name });

  const hideButton = screen.getByRole('button', {
    name: `Piilota alaorganisaatiot: ${organizations.data[0].name}`,
  });
  await act(async () => await user.click(hideButton));

  // Sub-organization should be hidden
  expect(
    screen.queryByRole('button', { name: organizations.data[1].name })
  ).not.toBeInTheDocument();
});
