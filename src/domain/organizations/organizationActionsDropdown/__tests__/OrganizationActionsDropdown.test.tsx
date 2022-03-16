import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  act,
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedDeleteOrganizationResponse } from '../../../organization/__mocks__/editOrganizationPage';
import {
  mockedOrganizationResponse,
  organization,
} from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import OrganizationActionsDropdown, {
  OrganizationActionsDropdownProps,
} from '../OrganizationActionsDropdown';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: OrganizationActionsDropdownProps = {
  organization,
};

const route = `/fi${ROUTES.KEYWORD_SETS}`;

const defaultMocks = [
  mockedDeleteOrganizationResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (
  props?: Partial<OrganizationActionsDropdownProps>,
  { mocks = defaultMocks, store }: CustomRenderOptions = {}
) =>
  render(<OrganizationActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista organisaatio/i });
  }
};

const getElement = (key: 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'editButton':
      return screen.getByRole('button', { name: /muokkaa organisaatiota/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = () => {
  const toggleButton = getElement('toggle');
  userEvent.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent(undefined, { store });

  const toggleButton = openMenu();
  getElement('editButton');
  await findElement('deleteButton');

  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should route to edit organization page', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = getElement('editButton');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/admin/organizations/edit/${organization.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete organization', async () => {
  renderComponent(undefined, { store });

  openMenu();

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista organisaatio/i,
  });
  userEvent.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
