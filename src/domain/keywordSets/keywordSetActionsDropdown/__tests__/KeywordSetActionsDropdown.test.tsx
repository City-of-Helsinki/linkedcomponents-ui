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
