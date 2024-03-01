import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  openDropdownMenu,
  render,
  screen,
  shouldToggleDropdownMenu,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  keyword,
  mockedDeleteKeywordResponse,
} from '../../../keyword/__mocks__/editKeywordPage';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import KeywordActionsDropdown, {
  KeywordActionsDropdownProps,
} from '../KeywordActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedDeleteKeywordResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = `/fi${ROUTES.KEYWORDS}`;
const routes = [route];

const defaultProps: KeywordActionsDropdownProps = {
  keyword,
};

const renderComponent = (props?: Partial<KeywordActionsDropdownProps>) =>
  render(<KeywordActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes,
  });

const findDeleteButton = () =>
  screen.findByRole('button', { name: /poista avainsana/i });

const getEditButton = () => screen.getByRole('button', { name: /muokkaa/i });

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openDropdownMenu();

  await findDeleteButton();
  getEditButton();
});

test('should route to edit keyword page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getEditButton();
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keywords/edit/${keyword.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = await findDeleteButton();
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista avainsana/i,
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Avainsana on poistettu' });
});
