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
  image,
  mockedDeleteImageResponse,
} from '../../../image/__mocks__/editImagePage';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import ImageActionsDropdown, {
  ImageActionsDropdownProps,
} from '../ImageActionsDropdown';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedDeleteImageResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = `/fi${ROUTES.IMAGES}`;
const routes = [route];

const props: ImageActionsDropdownProps = { image };

const renderComponent = () =>
  render(<ImageActionsDropdown {...props} />, {
    mocks,
    routes,
  });

const getDeleteButton = () =>
  screen.getByRole('button', { name: /poista kuva/i });

const getEditButton = () => screen.getByRole('button', { name: /muokkaa/i });

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openDropdownMenu();

  const enabledButtons = [getDeleteButton(), getEditButton()];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit image page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openDropdownMenu();

  const editButton = getEditButton();
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/images/edit/${image.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete image', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openDropdownMenu();

  const deleteButton = getDeleteButton();
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteImageButton = withinModal.getByRole('button', {
    name: /Poista kuva/i,
  });
  await user.click(deleteImageButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await screen.findByRole('alert', { name: 'Kuva on poistettu' });
});
