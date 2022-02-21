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
    case 'publish':
      return screen.getByRole('button', { name: 'Hyväksy ja julkaise' });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'updateDraft':
      return screen.getByRole('button', {
        name: 'Tallenna luonnos',
      });
    case 'updatePublic':
      return screen.getByRole('button', {
        name: 'Tallenna muutokset',
      });
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
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
    store,
  });

  const toggleButton = openMenu();
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

  openMenu();

  getElement('copy');

  const deleteButton = await findElement('delete');
  act(() => userEvent.click(deleteButton));
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updateDraft');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Draft);

  const publishButton = getElement('publish');
  userEvent.click(publishButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  openMenu();

  const hiddenButtons = [
    'Lykkää tapahtumaa',
    'Peruuta tapahtuma',
    'Tallenna muutokset',
  ];

  hiddenButtons.forEach((name) =>
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
  );
});

test('only copy button should be enabled when user is not logged in (draft)', () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Draft } },
  });

  openMenu();

  getElement('copy');

  const disabledButtons = getElements('disabledButtons');
  expect(disabledButtons).toHaveLength(4);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
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

  openMenu();

  getElement('copy');

  const postponeButton = await findElement('postpone');
  act(() => userEvent.click(postponeButton));
  expect(onPostpone).toBeCalled();

  openMenu();

  const cancelButton = getElement('cancel');
  act(() => userEvent.click(cancelButton));
  expect(onCancel).toBeCalled();

  openMenu();

  const deleteButton = getElement('delete');
  act(() => userEvent.click(deleteButton));
  expect(onDelete).toBeCalled();

  const updateButton = getElement('updatePublic');
  userEvent.click(updateButton);
  expect(onUpdate).toHaveBeenLastCalledWith(PublicationStatus.Public);

  openMenu();

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

  openMenu();

  await findElement('delete');
  getElement('copy');

  const disabledButtons = screen.getAllByRole('button', {
    name: 'Peruttuja tapahtumia ei voi muokata.',
  });
  expect(disabledButtons).toHaveLength(3);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('only copy button should be enabled when user is not logged in (public)', () => {
  renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  openMenu();

  getElement('copy');

  const disabledButtons = getElements('disabledButtons');
  expect(disabledButtons).toHaveLength(4);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should route to create event page when clicking copy button', async () => {
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  openMenu();

  const copyButton = getElement('copy');
  act(() => userEvent.click(copyButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/events/create')
  );
});

test('should route to search page when clicking back button', async () => {
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() => expect(history.location.pathname).toBe('/fi/search'));
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    props: { event: { ...event, publicationStatus: PublicationStatus.Public } },
    route: `/fi${ROUTES}?returnPath=${ROUTES.SEARCH}&returnPath=${ROUTES.EVENTS}`,
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

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
