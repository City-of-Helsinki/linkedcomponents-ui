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

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista paikka/i });
  }
};

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

const openMenu = () => {
  const toggleButton = getElement('toggle');
  userEvent.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', () => {
  renderComponent(undefined, { store });

  const toggleButton = openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent(undefined, { store });

  openMenu();

  getElement('editButton');
  await findElement('deleteButton');
});

test('should route to edit place page', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = getElement('editButton');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/places/edit/${place.id}`)
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword', async () => {
  renderComponent(undefined, { store });

  openMenu();

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista paikka/i,
  });
  userEvent.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
