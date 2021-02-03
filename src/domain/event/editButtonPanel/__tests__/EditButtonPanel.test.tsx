import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import { StoreState } from '../../../../types';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const event = fakeEvent();

const defaultProps: EditButtonPanelProps = {
  event: event,
  onCancel: jest.fn(),
  onDelete: jest.fn(),
  onPostpone: jest.fn(),
  onUpdate: jest.fn(),
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = ({
  props,
  store,
}: {
  props?: Partial<EditButtonPanelProps>;
  store?: Store<StoreState, AnyAction>;
}) => render(<EditButtonPanel {...defaultProps} {...props} />, { store });

const findComponent = (
  key:
    | 'back'
    | 'cancel'
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
      return screen.findByRole('button', { name: 'Peruuta tapahtuma' });
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'menu':
      return screen.findByRole('region', { name: /toiminnot/i });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'publish':
      return screen.findByRole('button', { name: 'Hyväksy ja julkaise' });
    case 'toggle':
      return screen.findByRole('button', { name: /toiminnot/i });
    case 'updateDraft':
      return screen.findByRole('button', {
        name: 'Tallenna muutokset luonnokseen',
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
  const event = fakeEvent({ publicationStatus: PublicationStatus.Draft });
  renderComponent({ props: { event }, store });

  const toggleButton = await openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /toiminnot/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons for draft event', async () => {
  const event = fakeEvent({ publicationStatus: PublicationStatus.Draft });
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onUpdate = jest.fn();
  renderComponent({ props: { event, onCancel, onDelete, onUpdate }, store });

  await openMenu();

  const cancelButton = await findComponent('cancel');
  userEvent.click(cancelButton);
  expect(onCancel).toBeCalled();

  const deleteButton = await findComponent('delete');
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = await findComponent('updateDraft');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Draft);

  const publishButton = await findComponent('publish');
  userEvent.click(publishButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  const hiddenButtons = ['Lykkää tapahtumaa', 'Tallenna muutokset'];

  hiddenButtons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  });
});

test('all buttons should be disabled when user is not logged in (draft)', async () => {
  const event = fakeEvent({ publicationStatus: PublicationStatus.Draft });
  renderComponent({ props: { event } });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });
  expect(buttons).toHaveLength(4);
  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });
});

test('should render correct buttons for public event', async () => {
  const event = fakeEvent({ publicationStatus: PublicationStatus.Public });
  const onCancel = jest.fn();
  const onDelete = jest.fn();
  const onPostpone = jest.fn();
  const onUpdate = jest.fn();
  renderComponent({
    props: { event, onCancel, onDelete, onPostpone, onUpdate },
    store,
  });

  await openMenu();

  const postponeButton = await findComponent('postpone');
  userEvent.click(postponeButton);
  expect(onPostpone).toBeCalled();

  const cancelButton = await findComponent('cancel');
  userEvent.click(cancelButton);
  expect(onCancel).toBeCalled();

  const deleteButton = await findComponent('delete');
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();

  const updateButton = await findComponent('updatePublic');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  const hiddenButtons = ['Tallenna muutokset luonnokseen'];

  hiddenButtons.forEach((name) => {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  });
});

test('only delete button should be enabled when event is cancelled', async () => {
  const event = fakeEvent({
    eventStatus: EventStatus.EventCancelled,
    publicationStatus: PublicationStatus.Public,
  });
  renderComponent({ props: { event }, store });

  await openMenu();

  const disabledButtons = screen.getAllByRole('button', {
    name: 'Peruttuja tapahtumia ei voi muokata.',
  });

  expect(disabledButtons).toHaveLength(3);

  disabledButtons.forEach((button) => {
    expect(button).toBeDisabled();
  });

  await findComponent('delete');
});

test('all buttons should be disabled when user is not logged in (public)', async () => {
  const event = fakeEvent({ publicationStatus: PublicationStatus.Public });
  renderComponent({ props: { event } });

  await openMenu();

  const buttons = screen.getAllByRole('button', {
    name: 'Sinulla ei ole oikeuksia muokata tapahtumia.',
  });
  expect(buttons).toHaveLength(4);
  buttons.forEach((button) => {
    expect(button).toBeDisabled();
  });
});

test('should route to events page when clicking back button', async () => {
  const event = fakeEvent({ publicationStatus: PublicationStatus.Public });
  const { history } = renderComponent({ props: { event } });

  const backButton = await findComponent('back');
  userEvent.click(backButton);

  expect(history.location.pathname).toBe('/fi/events');
});
