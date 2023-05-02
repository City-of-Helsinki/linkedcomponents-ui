import React from 'react';

import { ROUTES } from '../../../../constants';
import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { event } from '../../__mocks__/editEventPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const defaultProps: EditButtonPanelProps = {
  event: event,
  onCancel: jest.fn(),
  onDelete: jest.fn(),
  onPostpone: jest.fn(),
  onUpdate: jest.fn(),
  saving: null,
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = ({
  authContextValue,
  props,
  route = `/fi/${ROUTES.EDIT_EVENT}`,
}: {
  authContextValue?: AuthContextProps;
  props?: Partial<EditButtonPanelProps>;
  route?: string;
}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [route],
  });

const getElement = (
  key: 'back' | 'menu' | 'publish' | 'toggle' | 'updateDraft' | 'updatePublic'
) => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
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

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  const menu = getElement('menu');

  return { menu, toggleButton };
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({
    authContextValue,
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  const { toggleButton } = await openMenu();
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should show correct buttons for draft event', async () => {
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onUpdate = jest.fn();

  const user = userEvent.setup();
  renderComponent({
    authContextValue,
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Draft },
      onCancel,
      onDelete,
      onUpdate,
    },
  });

  const { menu } = await openMenu();

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

  await openMenu();

  const disabledButtons = [
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];

  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('all buttons should be disabled when user is not logged in (draft)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  const { menu } = await openMenu();

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
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onPostpone = jest.fn();
  const onUpdate = jest.fn();

  const user = userEvent.setup();
  renderComponent({
    authContextValue,
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Public },
      onCancel,
      onDelete,
      onPostpone,
      onUpdate,
    },
  });

  const { menu } = await openMenu();

  getMenuButton('copy', menu);

  const postponeButton = getMenuButton('postpone', menu);
  await waitFor(() => expect(postponeButton).toBeEnabled());
  await user.click(postponeButton);
  expect(onPostpone).toBeCalled();

  const { menu: menu2 } = await openMenu();

  const cancelButton = getMenuButton('cancel', menu2);
  await waitFor(() => expect(cancelButton).toBeEnabled());
  await user.click(cancelButton);
  expect(onCancel).toBeCalled();

  const { menu: menu3 } = await openMenu();

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

test('only copy and delete button should be enabled when event is cancelled', async () => {
  renderComponent({
    authContextValue,
    props: {
      event: {
        ...event,
        eventStatus: EventStatus.EventCancelled,
        publicationStatus: PublicationStatus.Public,
      },
    },
  });

  const { menu } = await openMenu();

  const enabledButtons = [
    getMenuButton('delete', menu),
    getMenuButton('copy', menu),
  ];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());

  const disabledButtons = [
    getElement('updatePublic'),
    getMenuButton('postpone', menu),
    getMenuButton('cancel', menu),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('all buttons should be enabled when user is not logged in (public)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const { menu } = await openMenu();

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
    authContextValue,
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const { menu } = await openMenu();

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
