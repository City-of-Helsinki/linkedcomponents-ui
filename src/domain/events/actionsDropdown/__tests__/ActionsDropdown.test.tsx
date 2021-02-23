import { MockedResponse } from '@apollo/react-testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

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
  within,
} from '../../../../utils/testUtils';
import {
  event,
  eventId,
  mockedCancelEventResponse,
  mockedDeleteEventResponse,
  mockedPostponeEventResponse,
} from '../../../event/__mocks__/constants';
import ActionsDropdown, { ActionsDropdownProps } from '../ActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: ActionsDropdownProps = {
  event,
};

const cancelledEvent = {
  ...event,
  eventStatus: EventStatus.EventCancelled,
  publicationStatus: PublicationStatus.Public,
};
const draftEvent = { ...event, publicationStatus: PublicationStatus.Draft };
const publicEvent = { ...event, publicationStatus: PublicationStatus.Public };

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = ({
  mocks,
  props,
  store,
}: {
  mocks?: MockedResponse[];
  props?: Partial<ActionsDropdownProps>;
  store?: Store<StoreState, AnyAction>;
}) =>
  render(<ActionsDropdown {...defaultProps} {...props} />, { mocks, store });

const findComponent = (
  key: 'cancel' | 'copy' | 'delete' | 'edit' | 'menu' | 'postpone' | 'toggle'
) => {
  switch (key) {
    case 'cancel':
      return screen.findByRole('button', { name: 'Peruuta tapahtuma' });
    case 'copy':
      return screen.findByRole('button', { name: 'Kopioi pohjaksi' });
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa tapahtumaa' });
    case 'menu':
      return screen.findByRole('region', { name: /toiminnot/i });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'toggle':
      return screen.findByRole('button', { name: /toiminnot/i });
  }
};

const openMenu = async () => {
  const toggleButton = await findComponent('toggle');
  userEvent.click(toggleButton);
  await findComponent('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent({ store });

  const toggleButton = await openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /toiminnot/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons for draft event', async () => {
  renderComponent({ props: { event: draftEvent }, store });

  await openMenu();

  await findComponent('cancel');
  await findComponent('copy');
  await findComponent('delete');
  await findComponent('edit');

  const hiddenButtons = ['Lykkää tapahtumaa'];

  hiddenButtons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  });
});

test('only edit and copy buttons should be enabled when user is not logged in (draft)', async () => {
  renderComponent({ props: { event: draftEvent } });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });
  expect(buttons).toHaveLength(2);
  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
  await findComponent('edit');
});

test('should render correct buttons for public event', async () => {
  renderComponent({
    props: { event: publicEvent },
    store,
  });

  await openMenu();

  await findComponent('cancel');
  await findComponent('copy');
  await findComponent('delete');
  await findComponent('edit');
  await findComponent('postpone');
});

test('only copy, edit and delete button should be enabled when event is cancelled', async () => {
  renderComponent({ props: { event: cancelledEvent }, store });

  await openMenu();

  const disabledButtons = screen.getAllByRole('button', {
    name: 'Peruttuja tapahtumia ei voi muokata.',
  });

  expect(disabledButtons).toHaveLength(2);

  disabledButtons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
  await findComponent('delete');
  await findComponent('edit');
});

test('only copy and edit button should be enabled when user is not logged in (public)', async () => {
  renderComponent({ props: { event: publicEvent } });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });

  expect(buttons).toHaveLength(3);

  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('copy');
  await findComponent('edit');
});

test('should route to create event page when clicking copy button', async () => {
  const { history } = renderComponent({ props: { event: publicEvent } });

  await openMenu();

  const copyButton = await findComponent('copy');
  userEvent.click(copyButton);

  await waitFor(() => {
    expect(history.location.pathname).toBe(`/fi/events/create`);
  });
});

test('should route to edit page when clicking edit button', async () => {
  const { history } = renderComponent({ props: { event: publicEvent } });

  await openMenu();

  const editButton = await findComponent('edit');
  userEvent.click(editButton);

  expect(history.location.pathname).toBe(`/fi/events/edit/${eventId}`);
});

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [mockedCancelEventResponse];

  renderComponent({ props: { event }, mocks, store });

  await openMenu();

  const cancelButton = await findComponent('cancel');
  userEvent.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = await withinModal.findByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  userEvent.click(cancelEventButton);

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [mockedDeleteEventResponse];

  renderComponent({ props: { event }, mocks, store });

  await openMenu();

  const deleteButton = await findComponent('delete');
  userEvent.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteEventButton = await withinModal.findByRole('button', {
    name: 'Poista tapahtuma',
  });
  userEvent.click(deleteEventButton);

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

test('should postpone event', async () => {
  const mocks: MockedResponse[] = [mockedPostponeEventResponse];

  renderComponent({ props: { event }, mocks, store });

  await openMenu();

  const cancelButton = await findComponent('postpone');
  userEvent.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = await withinModal.findByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(cancelEventButton);

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
