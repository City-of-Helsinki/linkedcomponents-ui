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
import {
  keywordSet,
  mockedDeleteKeywordSetResponse,
} from '../../../keywordSet/__mocks__/editKeywordSetPage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import ActionsDropdown, { ActionsDropdownProps } from '../ActionsDropdown';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: ActionsDropdownProps = { keywordSet };

const route = `/fi${ROUTES.KEYWORD_SETS}`;

const defaultMocks = [mockedDeleteKeywordSetResponse, mockedUserResponse];

const renderComponent = (
  props?: Partial<ActionsDropdownProps>,
  { mocks = defaultMocks, store }: CustomRenderOptions = {}
) =>
  render(<ActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsanaryhmä/i });
  }
};

const getElement = (key: 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
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

test('should route to edit keyword set page', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = getElement('editButton');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/admin/keyword-sets/edit/${keywordSet.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword set', async () => {
  renderComponent(undefined, { store });

  openMenu();

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista avainsanaryhmä/i,
  });
  userEvent.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
