import { PropsWithChildren } from 'react';

import {
  Registration,
  RegistrationFieldsFragment,
} from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import { registrations } from '../../__mocks__/registrationsPage';
import RegistrationsTable, {
  RegistrationsTableProps,
  SignupsColumn,
  WaitingListColumn,
} from '../RegistrationsTable';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const registrationId = getValue(registrations.data[0]?.id, '');
const eventName = getValue(registrations.data[0]?.event?.name?.fi, '');
const registration = registrations.data[0] as Registration;

const mocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const defaultProps: RegistrationsTableProps = {
  caption: 'Registrations table',
  registrations: [],
};

const FIND_LINK_TIMEOUT = 5000;

const renderComponent = (props?: Partial<RegistrationsTableProps>) =>
  render(<RegistrationsTable {...defaultProps} {...props} />, {
    mocks,
  });

test('should render registrations table', async () => {
  renderComponent();

  const columnHeaders = [
    'Nimi',
    'Julkaisija',
    'Osallistujia',
    'Jono',
    'Ilmoittautumisaika',
    'Tapahtuman ajankohta',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

describe('SignupsColumn', () => {
  const renderSignupsColumn = (registration: RegistrationFieldsFragment) => {
    const wrapper = ({ children }: PropsWithChildren) => <div>{children}</div>;

    return renderHook(() => SignupsColumn(registration), { wrapper });
  };

  test('should show correct signup numbers', async () => {
    expect(
      renderSignupsColumn({
        ...registration,
        currentAttendeeCount: 10,
        maximumAttendeeCapacity: 15,
      }).result.current
    ).toBe('10 / 15');
    expect(
      renderSignupsColumn({
        ...registration,
        currentAttendeeCount: 0,
        maximumAttendeeCapacity: 0,
      }).result.current
    ).toBe('0 / 0');
    expect(
      renderSignupsColumn({
        ...registration,
        currentAttendeeCount: 10,
        maximumAttendeeCapacity: null,
      }).result.current
    ).toBe('10');
  });
});

describe('WaitingListColumn', () => {
  const renderWaitingListColumn = (
    registration: RegistrationFieldsFragment
  ) => {
    const wrapper = ({ children }: PropsWithChildren) => <div>{children}</div>;

    return renderHook(() => WaitingListColumn(registration), { wrapper });
  };
  test('should show correct waiting list numbers', async () => {
    expect(
      renderWaitingListColumn({
        ...registration,
        currentWaitingListCount: 10,
        waitingListCapacity: 15,
      }).result.current
    ).toBe('10 / 15');
    expect(
      renderWaitingListColumn({
        ...registration,
        currentWaitingListCount: 0,
        waitingListCapacity: 0,
      }).result.current
    ).toBe('0 / 0');
    expect(
      renderWaitingListColumn({
        ...registration,
        currentWaitingListCount: 10,
        waitingListCapacity: null,
      }).result.current
    ).toBe('10');
  });
});

test('should open registration page by clicking event name', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ registrations: [registration] });

  const button = await screen.findByRole(
    'button',
    { name: registrationId },
    { timeout: FIND_LINK_TIMEOUT }
  );
  await user.click(button);
  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('event name should work as a link to edit registration page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ registrations: [registration] });

  const registrationLink = await screen.findByRole(
    'link',
    { name: eventName },
    { timeout: FIND_LINK_TIMEOUT }
  );
  await user.click(registrationLink);

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open registration page by pressing enter on row', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ registrations: [registration] });

  const button = await screen.findByRole(
    'button',
    { name: registrationId },
    { timeout: FIND_LINK_TIMEOUT }
  );
  await user.click(button);
  await user.type(button, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ registrations: [registration] });

  const withinRow = within(
    screen.getByRole('button', { name: registrationId })
  );
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', { name: /muokkaa/i });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registrationId}`
    )
  );
});
