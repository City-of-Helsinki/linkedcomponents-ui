import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);
const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.EDIT_EVENT}`,
  store,
}: {
  props?: Partial<EditButtonPanelProps>;
  route?: string;
  store?: Store<StoreState, AnyAction>;
}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'delete' | 'postpone') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
  }
};

const getElement = (
  key:
    | 'back'
    | 'cancel'
    | 'copy'
    | 'delete'
    | 'menu'
    | 'postpone'
    | 'publish'
    | 'toggle'
    | 'updateDraft'
    | 'updatePublic'
) => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta tapahtuma' });
    case 'copy':
      return screen.getByRole('button', { name: 'Kopioi pohjaksi' });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista tapahtuma' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'postpone':
      return screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
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

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
    store,
  });

  const toggleButton = await openMenu();
  await act(async () => await user.click(toggleButton));
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
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Draft },
      onCancel,
      onDelete,
      onUpdate,
    },
    store,
  });

  await openMenu();

  getElement('copy');

  const deleteButton = await findElement('delete');
  await act(async () => await user.click(deleteButton));
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updateDraft');
  await act(async () => await user.click(updateButton));
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Draft);

  const publishButton = getElement('publish');
  await act(async () => await user.click(publishButton));
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  await openMenu();

  const disabledButtons = [getElement('postpone'), getElement('cancel')];

  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('only copy button should be enabled when user is not logged in (draft)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  await openMenu();

  getElement('copy');

  const deleteButton = await findElement('delete');
  const disabledButtons = [
    deleteButton,
    getElement('updateDraft'),
    getElement('postpone'),
    getElement('cancel'),
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
    props: {
      event: { ...event, publicationStatus: PublicationStatus.Public },
      onCancel,
      onDelete,
      onPostpone,
      onUpdate,
    },
    store,
  });

  await openMenu();

  getElement('copy');

  const postponeButton = await findElement('postpone');
  await act(async () => await user.click(postponeButton));
  expect(onPostpone).toBeCalled();

  await openMenu();

  const cancelButton = getElement('cancel');
  await act(async () => await user.click(cancelButton));
  expect(onCancel).toBeCalled();

  await openMenu();

  const deleteButton = getElement('delete');
  await act(async () => await user.click(deleteButton));
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updatePublic');
  await act(async () => await user.click(updateButton));
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  await openMenu();

  const hiddenButtons = ['Tallenna luonnos'];

  hiddenButtons.forEach((name) =>
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
  );
});

test('only copy and delete button should be enabled when event is cancelled', async () => {
  renderComponent({
    props: {
      event: {
        ...event,
        eventStatus: EventStatus.EventCancelled,
        publicationStatus: PublicationStatus.Public,
      },
    },
    store,
  });

  await openMenu();

  await findElement('delete');
  getElement('copy');

  const disabledButtons = [
    getElement('updatePublic'),
    getElement('postpone'),
    getElement('cancel'),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('only copy button should be enabled when user is not logged in (public)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  await openMenu();

  getElement('copy');

  const disabledButtons = [
    getElement('delete'),
    getElement('updatePublic'),
    getElement('postpone'),
    getElement('cancel'),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should route to create event page when clicking copy button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  await openMenu();

  const copyButton = getElement('copy');
  await act(async () => await user.click(copyButton));

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
  await act(async () => await user.click(backButton));

  await waitFor(() => expect(history.location.pathname).toBe('/fi/search'));
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
    route: `/fi${ROUTES}?returnPath=${ROUTES.SEARCH}&returnPath=${ROUTES.EVENTS}`,
  });

  const backButton = getElement('back');
  await act(async () => await user.click(backButton));

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
