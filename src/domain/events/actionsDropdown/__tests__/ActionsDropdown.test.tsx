import { MockedResponse } from '@apollo/client/testing';
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
  mockedOrganizationAncestorsResponse,
  mockedPostponeEventResponse,
  mockedUserResponse,
} from '../../../event/__mocks__/editEventPage';
import ActionsDropdown, { ActionsDropdownProps } from '../ActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: ActionsDropdownProps = {
  event,
};

const defaultMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

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
  mocks = defaultMocks,
  props,
  store,
}: {
  mocks?: MockedResponse[];
  props?: Partial<ActionsDropdownProps>;
  store?: Store<StoreState, AnyAction>;
}) =>
  render(<ActionsDropdown {...defaultProps} {...props} />, { mocks, store });

const findElement = (key: 'cancel' | 'delete' | 'edit' | 'postpone') => {
  switch (key) {
    case 'cancel':
      return screen.findByRole('button', { name: 'Peruuta tapahtuma' });
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa tapahtumaa' });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
  }
};

const getElement = (
  key: 'cancel' | 'copy' | 'delete' | 'edit' | 'menu' | 'postpone' | 'toggle'
) => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta tapahtuma' });
    case 'copy':
      return screen.getByRole('button', { name: 'Kopioi pohjaksi' });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista tapahtuma' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa tapahtumaa' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'postpone':
      return screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const getElements = (key: 'disabledButtons') => {
  switch (key) {
    case 'disabledButtons':
      return screen.getAllByRole('button', {
        name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
      });
  }
};

const openMenu = () => {
  const toggleButton = getElement('toggle');
  userEvent.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', () => {
  renderComponent({ store });

  const toggleButton = openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons for draft event', async () => {
  renderComponent({ props: { event: draftEvent }, store });

  openMenu();

  getElement('copy');
  await findElement('delete');
  getElement('edit');

  const hiddenButtons = ['Lykkää tapahtumaa', 'Peruuta tapahtuma'];

  hiddenButtons.forEach((name) =>
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
  );
});

test('only edit and copy buttons should be enabled when user is not logged in (draft)', async () => {
  renderComponent({ props: { event: draftEvent } });

  openMenu();

  const disabledButtons = getElements('disabledButtons');
  expect(disabledButtons).toHaveLength(3);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  getElement('copy');
  await findElement('edit');
});

test('should render correct buttons for public event', async () => {
  renderComponent({
    props: { event: publicEvent },
    store,
  });

  openMenu();

  await findElement('cancel');
  getElement('copy');
  getElement('delete');
  getElement('edit');
  getElement('postpone');
});

test('only copy, edit and delete button should be enabled when event is cancelled', async () => {
  renderComponent({ props: { event: cancelledEvent }, store });

  openMenu();

  const disabledButtons = screen.getAllByRole('button', {
    name: 'Peruttuja tapahtumia ei voi muokata.',
  });
  expect(disabledButtons).toHaveLength(2);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  getElement('copy');
  await findElement('delete');
  getElement('edit');
});

test('only copy and edit button should be enabled when user is not logged in (public)', async () => {
  renderComponent({ props: { event: publicEvent } });

  openMenu();

  const disabledButtons = getElements('disabledButtons');
  expect(disabledButtons).toHaveLength(3);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  getElement('copy');
  await findElement('edit');
});

test('should route to create event page when clicking copy button', async () => {
  const { history } = renderComponent({ props: { event: publicEvent } });

  openMenu();

  const copyButton = getElement('copy');
  userEvent.click(copyButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/events/create`)
  );
});

test('should route to edit page when clicking edit button', async () => {
  const { history } = renderComponent({ props: { event: publicEvent } });

  openMenu();

  const editButton = await findElement('edit');
  userEvent.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/events/edit/${eventId}`)
  );
});

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [...defaultMocks, mockedCancelEventResponse];

  renderComponent({ props: { event }, mocks, store });

  openMenu();

  const cancelButton = await findElement('cancel');
  userEvent.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  userEvent.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [...defaultMocks, mockedDeleteEventResponse];

  renderComponent({ props: { event }, mocks, store });

  openMenu();

  const deleteButton = await findElement('delete');
  userEvent.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteEventButton = withinModal.getByRole('button', {
    name: 'Poista tapahtuma',
  });
  userEvent.click(deleteEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should postpone event', async () => {
  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedPostponeEventResponse,
  ];

  renderComponent({ props: { event }, mocks, store });

  openMenu();

  const postponeButton = await findElement('postpone');
  userEvent.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
