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
  image,
  mockedDeleteImageResponse,
} from '../../../image/__mocks__/editImagePage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import ImageActionsDropdown, {
  ImageActionsDropdownProps,
} from '../ImageActionsDropdown';

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: ImageActionsDropdownProps = {
  image,
};

const route = `/fi${ROUTES.IMAGES}`;

const defaultMocks = [mockedDeleteImageResponse, mockedUserResponse];

const renderComponent = (
  props?: Partial<ImageActionsDropdownProps>,
  { mocks = defaultMocks, store }: CustomRenderOptions = {}
) =>
  render(<ImageActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista kuva/i });
  }
};

const getElement = (key: 'deleteButton' | 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'deleteButton':
      return screen.getByRole('button', { name: /poista kuva/i });
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

test('should route to edit image page', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = getElement('editButton');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/images/edit/${image.id}`)
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete image', async () => {
  renderComponent(undefined, { store });

  openMenu();

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteImageButton = withinModal.getByRole('button', {
    name: /Poista kuva/i,
  });
  userEvent.click(deleteImageButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
