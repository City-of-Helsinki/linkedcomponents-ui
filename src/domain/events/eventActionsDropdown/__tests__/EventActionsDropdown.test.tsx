/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedResponse } from '@apollo/client/testing';

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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultProps: EventActionsDropdownProps = {
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

const renderComponent = ({
  mocks = defaultMocks,
  props,
}: {
  mocks?: MockedResponse[];
  props?: Partial<EventActionsDropdownProps>;
} = {}) =>
  render(<EventActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [`/fi${ROUTES.SEARCH}`],
  });

const getElement = (
  key: 'cancel' | 'copy' | 'delete' | 'edit' | 'postpone' | 'email'
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
    case 'postpone':
      return screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'email':
      return screen.getByRole('button', { name: 'Lähetä sähköposti' });
  }
};

test('should toggle menu by clicking actions button', async () => {
  renderComponent();

  await shouldToggleDropdownMenu();
});

test('should render correct buttons for draft event', async () => {
  renderComponent({ props: { event: draftEvent } });

  await openDropdownMenu();

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
  mockUnauthenticatedLoginState();
  renderComponent({ props: { event: draftEvent } });

  await openDropdownMenu();

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
    props: { event: publicEvent },
  });

  await openDropdownMenu();

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
  renderComponent({ props: { event: cancelledEvent } });

  await openDropdownMenu();

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
  mockUnauthenticatedLoginState();
  renderComponent({ props: { event: publicEvent } });

  await openDropdownMenu();

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
    props: { event: publicEvent },
  });

  await openDropdownMenu();

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

  await openDropdownMenu();

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

  renderComponent({ props: { event }, mocks });

  await openDropdownMenu();

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

  renderComponent({ props: { event }, mocks });

  await openDropdownMenu();

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

  renderComponent({ props: { event }, mocks });

  await openDropdownMenu();

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
  /* @ts-ignore */
  delete window.location;

  window.location = { href: '' } as Location;
  const specialEvent = { ...event };
  specialEvent.createdBy = 'Jaska Jokunen - testisähköposti@testidomaini.fi';

  const user = userEvent.setup();
  renderComponent({ props: { event: specialEvent }, mocks });

  await openDropdownMenu();

  const sendMailButton = getElement('email');
  await user.click(sendMailButton);

  await waitFor(() =>
    expect(window.location.href).toBe(
      'mailto:testisähköposti@testidomaini.fi?subject=Name fi'
    )
  );

  window.location = originalLocation;
});

test('should find the email address even when the createdBy field has extra dashes in the name or email', async () => {
  const mocks: MockedResponse[] = [...defaultMocks];

  const originalLocation = window.location;
  /* @ts-ignore */
  delete window.location;

  window.location = { href: '' } as Location;
  const specialEvent = { ...event };
  specialEvent.createdBy =
    'Jaska Joki-Niemi - jaska_joki-niemi@testi-domaini.fi';

  const user = userEvent.setup();
  renderComponent({ props: { event: specialEvent }, mocks });

  await openDropdownMenu();

  const sendMailButton = getElement('email');
  await user.click(sendMailButton);

  await waitFor(() =>
    expect(window.location.href).toBe(
      'mailto:jaska_joki-niemi@testi-domaini.fi?subject=Name fi'
    )
  );

  window.location = originalLocation;
});
