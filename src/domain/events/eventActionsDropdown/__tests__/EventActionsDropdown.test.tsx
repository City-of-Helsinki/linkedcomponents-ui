import { MockedResponse } from '@apollo/client/testing';
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
import {
  event,
  eventId,
  mockedCancelEventResponse,
  mockedDeleteEventResponse,
  mockedPostponeEventResponse,
} from '../../../event/__mocks__/editEventPage';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EventActionsDropdown, {
  EventActionsDropdownProps,
} from '../EventActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: EventActionsDropdownProps = {
  event,
};

const defaultMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const authContextValue = fakeAuthenticatedAuthContextValue();

const cancelledEvent = {
  ...event,
  eventStatus: EventStatus.EventCancelled,
  publicationStatus: PublicationStatus.Public,
};
const draftEvent = { ...event, publicationStatus: PublicationStatus.Draft };
const publicEvent = { ...event, publicationStatus: PublicationStatus.Public };

const renderComponent = ({
  authContextValue,
  mocks = defaultMocks,
  props,
}: {
  authContextValue?: AuthContextProps;
  mocks?: MockedResponse[];
  props?: Partial<EventActionsDropdownProps>;
}) =>
  render(<EventActionsDropdown {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [`/fi${ROUTES.SEARCH}`],
  });

const getElement = (
  key:
    | 'cancel'
    | 'copy'
    | 'delete'
    | 'edit'
    | 'menu'
    | 'postpone'
    | 'toggle'
    | 'email'
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
    case 'email':
      return screen.getByRole('button', { name: 'Lähetä sähköposti' });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({ authContextValue });

  const toggleButton = await openMenu();
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons for draft event', async () => {
  renderComponent({ props: { event: draftEvent }, authContextValue });

  await openMenu();

  const disabledButtons = [getElement('postpone'), getElement('cancel')];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  const enabledButtons = [
    getElement('copy'),
    getElement('delete'),
    getElement('edit'),
  ];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('only edit button should be enabled when user is not logged in (draft)', async () => {
  renderComponent({ props: { event: draftEvent } });

  await openMenu();

  const disabledButtons = [
    getElement('copy'),
    getElement('postpone'),
    getElement('cancel'),
    getElement('delete'),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  const enabledButtons = [getElement('edit')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should render correct buttons for public event', async () => {
  renderComponent({
    authContextValue,
    props: { event: publicEvent },
  });

  await openMenu();

  const enabledButtons = [
    getElement('cancel'),
    getElement('copy'),
    getElement('delete'),
    getElement('edit'),
    getElement('postpone'),
  ];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('only copy, edit and delete button should be enabled when event is cancelled', async () => {
  renderComponent({ authContextValue, props: { event: cancelledEvent } });

  await openMenu();

  const disabledButtons = [getElement('postpone'), getElement('cancel')];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  const enabledButtons = [
    getElement('copy'),
    getElement('delete'),
    getElement('edit'),
  ];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('only edit button should be enabled when user is not logged in (public)', async () => {
  renderComponent({ props: { event: publicEvent } });

  await openMenu();

  const disabledButtons = [
    getElement('copy'),
    getElement('postpone'),
    getElement('cancel'),
    getElement('delete'),
  ];
  disabledButtons.forEach((button) => expect(button).toBeDisabled());

  const enabledButtons = [getElement('edit')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to create event page when clicking copy button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    authContextValue,
    props: { event: publicEvent },
  });

  await openMenu();

  const copyButton = getElement('copy');
  await waitFor(() => expect(copyButton).toBeEnabled());
  await user.click(copyButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/events/create`)
  );
});

test('should route to edit page when clicking edit button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ props: { event: publicEvent } });

  await openMenu();

  const editButton = getElement('edit');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/events/edit/${eventId}`)
  );
  expect(history.location.search).toBe(`?returnPath=%2Fsearch`);
});

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [...defaultMocks, mockedCancelEventResponse];
  const user = userEvent.setup();

  renderComponent({ authContextValue, props: { event }, mocks });

  await openMenu();

  const cancelButton = getElement('cancel');
  await user.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  await user.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [...defaultMocks, mockedDeleteEventResponse];
  const user = userEvent.setup();

  renderComponent({ authContextValue, props: { event }, mocks });

  await openMenu();

  const deleteButton = getElement('delete');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteEventButton = withinModal.getByRole('button', {
    name: 'Poista tapahtuma',
  });
  await user.click(deleteEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should postpone event', async () => {
  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedPostponeEventResponse,
  ];
  const user = userEvent.setup();

  renderComponent({ authContextValue, props: { event }, mocks });

  await openMenu();

  const postponeButton = getElement('postpone');
  await user.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  await user.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should call the mailto function when clicking Send Email button', async () => {
  const mocks: MockedResponse[] = [...defaultMocks];

  const originalLocation = window.location;

  delete window.location;

  window.location = { href: '' };
  const specialEvent = { ...event };
  specialEvent.createdBy = 'Jaska Jokunen - testisähköposti@testidomaini.fi';

  const user = userEvent.setup();
  renderComponent({ authContextValue, props: { event: specialEvent }, mocks });

  await openMenu();

  const sendMailButton = getElement('email');
  await user.click(sendMailButton);

  await waitFor(() =>
    expect(window.location.href).toBe(
      'mailto:testisähköposti@testidomaini.fi?subject=Name fi'
    )
  );

  window.location = originalLocation;
});
