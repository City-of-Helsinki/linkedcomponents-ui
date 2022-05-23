import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  act,
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  mockedDeletePlaceResponse,
  place,
} from '../../../place/__mocks__/editPlacePage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import PlaceActionsDropdown, {
  PlaceActionsDropdownProps,
} from '../PlaceActionsDropdown';

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: PlaceActionsDropdownProps = {
  place,
};

const route = `/fi${ROUTES.KEYWORDS}`;

const defaultMocks = [mockedDeletePlaceResponse, mockedUserResponse];

const renderComponent = (
  props?: Partial<PlaceActionsDropdownProps>,
  { mocks = defaultMocks, store }: CustomRenderOptions = {}
) =>
  render(<PlaceActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const getElement = (key: 'deleteButton' | 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'deleteButton':
      return screen.getByRole('button', { name: /poista paikka/i });
    case 'editButton':
      return screen.getByRole('button', { name: /muokkaa/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent(undefined, { store });

  const toggleButton = await openMenu();
  await act(async () => await user.click(toggleButton));
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent(undefined, { store });

  await openMenu();

  const enabledButtons = [getElement('deleteButton'), getElement('editButton')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit place page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('editButton');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/places/edit/${place.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword', async () => {
  const user = userEvent.setup();
  renderComponent(undefined, { store });

  await openMenu();

  const deleteButton = getElement('deleteButton');
  await act(async () => await user.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista paikka/i,
  });
  await act(async () => await user.click(deleteKeywordButton));

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
