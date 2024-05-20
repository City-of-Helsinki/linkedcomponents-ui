import { ROUTES } from '../../../../constants';
import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../utils/mockLoginHooks';
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
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { event } from '../../__mocks__/editEventPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: EditButtonPanelProps = {
  event: event,
  onCancel: vi.fn(),
  onDelete: vi.fn(),
  onPostpone: vi.fn(),
  onUpdate: vi.fn(),
  saving: null,
};

const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.EDIT_EVENT}`,
}: {
  props?: Partial<EditButtonPanelProps>;
  route?: string;
}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
  });

const getElement = (
  key: 'back' | 'publish' | 'toggle' | 'updateDraft' | 'updatePublic'
) => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'publish':
      return screen.getByRole('button', { name: 'Hyväksy ja julkaise' });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'updateDraft':
      return screen.getByRole('button', { name: 'Tallenna luonnos' });
    case 'updatePublic':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
  }
};

const getMenuButton = (
  key: 'cancel' | 'copy' | 'delete' | 'postpone',
  menu: HTMLElement
) => {
  const withinMenu = within(menu);
  switch (key) {
    case 'cancel':
      return withinMenu.getByRole('button', { name: 'Peruuta tapahtuma' });
    case 'copy':
      return withinMenu.getByRole('button', { name: 'Kopioi pohjaksi' });
    case 'delete':
      return withinMenu.getByRole('button', { name: 'Poista tapahtuma' });
    case 'postpone':
      return withinMenu.getByRole('button', { name: 'Lykkää tapahtumaa' });
  }
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  await shouldToggleDropdownMenu();
});

test('should show correct buttons for draft event', async () => {
  const onCancel = vi.fn();
  const onDelete = vi.fn();
  const onUpdate = vi.fn();

  const user = userEvent.setup();
  renderComponent({
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Draft },
      onCancel,
      onDelete,
      onUpdate,
    },
  });

  const { menu } = await openDropdownMenu();

  getMenuButton('copy', menu);

  const deleteButton = getMenuButton('delete', menu);
  await waitFor(() => expect(deleteButton).toBeEnabled());
  await user.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updateDraft');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await user.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Draft);

  const publishButton = getElement('publish');
  await waitFor(() => expect(publishButton).toBeEnabled());
  await user.click(publishButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  await openDropdownMenu();

  const disabledButtons = [
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];

  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('all buttons should be disabled when user is not logged in (draft)', async () => {
  mockUnauthenticatedLoginState();
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  const { menu } = await openDropdownMenu();

  const disabledButtons = [
    getMenuButton('copy', menu),
    getMenuButton('delete', menu),
    getElement('updateDraft'),
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];

  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should render correct buttons for public event', async () => {
  const onCancel = vi.fn();
  const onDelete = vi.fn();
  const onPostpone = vi.fn();
  const onUpdate = vi.fn();

  const user = userEvent.setup();
  renderComponent({
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Public },
      onCancel,
      onDelete,
      onPostpone,
      onUpdate,
    },
  });

  const { menu } = await openDropdownMenu();

  getMenuButton('copy', menu);

  const postponeButton = getMenuButton('postpone', menu);
  await waitFor(() => expect(postponeButton).toBeEnabled());
  await user.click(postponeButton);
  expect(onPostpone).toBeCalled();

  const { menu: menu2 } = await openDropdownMenu();

  const cancelButton = getMenuButton('cancel', menu2);
  await waitFor(() => expect(cancelButton).toBeEnabled());
  await user.click(cancelButton);
  expect(onCancel).toBeCalled();

  const { menu: menu3 } = await openDropdownMenu();

  const deleteButton = getMenuButton('delete', menu3);
  await waitFor(() => expect(deleteButton).toBeEnabled());
  await user.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updatePublic');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await user.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  const hiddenButtons = ['Tallenna luonnos'];

  hiddenButtons.forEach((name) =>
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
  );
});

test('postpone and cancel actions should be disabled when event is cancelled', async () => {
  renderComponent({
    props: {
      event: {
        ...event,
        eventStatus: EventStatus.EventCancelled,
        publicationStatus: PublicationStatus.Public,
      },
    },
  });

  const { menu } = await openDropdownMenu();

  const enabledButtons = [
    getMenuButton('delete', menu),
    getMenuButton('copy', menu),
    getElement('updatePublic'),
  ];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());

  const disabledButtons = [
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('all buttons should be disabled when user is not logged in (public)', async () => {
  mockUnauthenticatedLoginState();
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const { menu } = await openDropdownMenu();

  const disabledButtons = [
    getMenuButton('copy', menu),
    getMenuButton('delete', menu),
    getElement('updatePublic'),
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should route to create event page when clicking copy button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const { menu } = await openDropdownMenu();

  const copyButton = getMenuButton('copy', menu);
  await waitFor(() => expect(copyButton).toBeEnabled());
  await user.click(copyButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/events/create')
  );
});

test('should route to search page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() => expect(history.location.pathname).toBe('/fi/search'));
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
    route: `/fi${ROUTES}?returnPath=${ROUTES.SEARCH}&returnPath=${ROUTES.EVENTS}`,
  });

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() => expect(history.location.pathname).toBe('/fi/events'));
  expect(history.location.search).toBe(`?returnPath=%2Fsearch`);
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  getElement('toggle');
});
