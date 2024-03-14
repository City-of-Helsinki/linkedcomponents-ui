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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

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
  { mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<OrganizationActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const findDeleteButton = () =>
  screen.findByRole('button', { name: /poista organisaatio/i });

const getEditButton = () =>
  screen.getByRole('button', { name: /muokkaa organisaatiota/i });

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should route to edit organization page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getEditButton();
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/organizations/edit/${organization.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete organization', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = await findDeleteButton();
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista organisaatio/i,
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Organisaatio on poistettu' });
});
