import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import {
  event,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
} from '../../__mocks__/editEventPage';
import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const defaultProps: EditButtonPanelProps = {
  event: event,
  onCancel: jest.fn(),
  onDelete: jest.fn(),
  onPostpone: jest.fn(),
  onUpdate: jest.fn(),
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);
const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = ({
  props,
  store,
}: {
  props?: Partial<EditButtonPanelProps>;
  store?: Store<StoreState, AnyAction>;
}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, { mocks, store });

const findComponent = (
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
      return screen.findByRole('button', { name: 'Takaisin' });
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta tapahtuma' });
    case 'copy':
      return screen.findByRole('button', { name: 'Kopioi pohjaksi' });
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'menu':
      return screen.findByRole('region', { name: /valinnat/i });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'publish':
      return screen.findByRole('button', { name: 'Hyväksy ja julkaise' });
    case 'toggle':
      return screen.findByRole('button', { name: /valinnat/i });
    case 'updateDraft':
      return screen.findByRole('button', {
        name: 'Tallenna luonnos',
      });
    case 'updatePublic':
      return screen.findByRole('button', {
        name: 'Tallenna muutokset',
      });
  }
};

const openMenu = async () => {
  const toggleButton = await findComponent('toggle');
  userEvent.click(toggleButton);
  await findComponent('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
    store,
  });

  const toggleButton = await openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons for draft event', async () => {
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onUpdate = jest.fn();
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

  await findComponent('copy');

  const deleteButton = await findComponent('delete');
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = await findComponent('updateDraft');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Draft);

  const publishButton = await findComponent('publish');
  userEvent.click(publishButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  await openMenu();

  const hiddenButtons = [
    'Lykkää tapahtumaa',
    'Peruuta tapahtuma',
    'Tallenna muutokset',
  ];

  hiddenButtons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  });
});

test('only copy button should be enabled when user is not logged in (draft)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });
  expect(buttons).toHaveLength(4);
  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
});

test('should render correct buttons for public event', async () => {
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onPostpone = jest.fn();
  const onUpdate = jest.fn();
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

  await findComponent('copy');

  const postponeButton = await findComponent('postpone');
  userEvent.click(postponeButton);
  expect(onPostpone).toBeCalled();

  await openMenu();

  const cancelButton = await findComponent('cancel');
  userEvent.click(cancelButton);
  expect(onCancel).toBeCalled();

  await openMenu();

  const deleteButton = await findComponent('delete');
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = await findComponent('updatePublic');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  await openMenu();

  const hiddenButtons = ['Tallenna luonnos'];

  hiddenButtons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  });
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

  const disabledButtons = screen.getAllByRole('button', {
    name: 'Peruttuja tapahtumia ei voi muokata.',
  });

  expect(disabledButtons).toHaveLength(3);

  disabledButtons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
  await findComponent('delete');
});

test('only copy button should be enabled when user is not logged in (public)', async () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });
  expect(buttons).toHaveLength(4);
  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
});

test('should route to create event page when clicking copy button', async () => {
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  await openMenu();

  const copyButton = await findComponent('copy');
  userEvent.click(copyButton);

  await waitFor(() => {
    expect(history.location.pathname).toBe('/fi/events/create');
  });
});

test('should route to events page when clicking back button', async () => {
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const backButton = await findComponent('back');
  userEvent.click(backButton);

  await waitFor(() => {
    expect(history.location.pathname).toBe('/fi/events');
  });
});
