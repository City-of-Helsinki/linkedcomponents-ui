import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  CustomRenderOptions,
  openDropdownMenu,
  render,
  screen,
  shouldToggleDropdownMenu,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  mockedDeletePlaceResponse,
  place,
} from '../../../place/__mocks__/editPlacePage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import PlaceActionsDropdown, {
  PlaceActionsDropdownProps,
} from '../PlaceActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: PlaceActionsDropdownProps = {
  place,
};

const route = `/fi${ROUTES.KEYWORDS}`;

const defaultMocks = [
  mockedDeletePlaceResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (
  props?: Partial<PlaceActionsDropdownProps>,
  { mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<PlaceActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const getElement = (key: 'deleteButton' | 'editButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.getByRole('button', { name: /poista paikka/i });
    case 'editButton':
      return screen.getByRole('button', { name: /muokkaa/i });
  }
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openDropdownMenu();

  const enabledButtons = [getElement('deleteButton'), getElement('editButton')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit place page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getElement('editButton');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/places/edit/${place.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete place', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = getElement('deleteButton');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista paikka/i,
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Paikka on poistettu' });
});
