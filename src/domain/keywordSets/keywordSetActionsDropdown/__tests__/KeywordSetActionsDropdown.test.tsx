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
import {
  keywordSet,
  mockedDeleteKeywordSetResponse,
} from '../../../keywordSet/__mocks__/editKeywordSetPage';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import KeywordSetActionsDropdown, {
  KeywordSetActionsDropdownProps,
} from '../KeywordSetActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: KeywordSetActionsDropdownProps = { keywordSet };

const route = `/fi${ROUTES.KEYWORD_SETS}`;

const defaultMocks = [
  mockedDeleteKeywordSetResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (
  props?: Partial<KeywordSetActionsDropdownProps>,
  { mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<KeywordSetActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const findDeleteButton = () =>
  screen.findByRole('button', { name: /poista avainsanaryhmä/i });

const getEditButton = () => screen.getByRole('button', { name: /muokkaa/i });

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should route to edit keyword set page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getEditButton();
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keyword-sets/edit/${keywordSet.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword set', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = await findDeleteButton();
  await user.click(deleteButton);

  const dialog = await screen.findByRole(
    'dialog',
    { name: /Varmista avainsanaryhmän poistaminen/i },
    { timeout: 5000 }
  );
  const withinModal = within(dialog);
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista avainsanaryhmä/i,
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Avainsanaryhmä on poistettu' });
});
