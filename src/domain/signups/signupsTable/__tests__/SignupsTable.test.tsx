import { MockedResponse } from '@apollo/client/testing';

import { AttendeeStatus, ContactPerson } from '../../../../generated/graphql';
import { fakeSignups } from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  within,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import {
  mockedSignupGroupResponse,
  signupGroup,
} from '../../../signupGroup/__mocks__/editSignupGroupPage';
import { SignupGroupFormProvider } from '../../../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import {
  attendeeNames,
  attendeeNamesPage2,
  attendees,
  attendeesWithGroup,
  attendeesWithPaymentCancellation,
  attendeesWithPaymentRefund,
  getMockedAttendeesResponse,
  mockedAttendeesPage2Response,
  mockedAttendeesResponse,
  signupGroupId,
} from '../../__mocks__/signupsPage';
import SignupsTable, { SignupsTableProps } from '../SignupsTable';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedEventResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
  mockedSignupGroupResponse,
];

const defaultProps: SignupsTableProps = {
  caption: 'Signups table',
  countKey: 'signupsPage.attendeeTableCount',
  pagePath: 'attendeePage',
  registration: registration,
  signupsVariables: { attendeeStatus: AttendeeStatus.Attending },
};

const signupName = [attendeeNames[0].firstName, attendeeNames[0].lastName].join(
  ' '
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) => {
  return render(
    <SignupGroupFormProvider registration={registration}>
      <SignupsTable {...defaultProps} />
    </SignupGroupFormProvider>,
    { mocks }
  );
};

const getElement = (key: 'page1' | 'page2') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('link', { name: 'Sivu 2' });
  }
};

const findSignupRow = async (name: string) =>
  (await screen.findByRole('link', { name })).parentElement?.parentElement
    ?.parentElement as HTMLElement;

test('should render signups table', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: fakeSignups(0) }),
  ]);

  await loadingSpinnerIsNotInDocument();

  screen.getByRole('heading', { name: '0 osallistujaa' });
  screen.getByRole('table', { name: 'Signups table' });

  const columnHeaders = [
    'Nimi',
    'Puhelinnumero',
    'Yhteyshenkilön sähköposti',
    'Yhteyshenkilön puhelinnumero',
    'Status',
    'Toiminnot',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  await screen.findByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should navigate between pages', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    mockedAttendeesResponse,
    mockedAttendeesPage2Response,
  ]);

  await loadingSpinnerIsNotInDocument();
  const attendeePage2Name = [
    attendeeNamesPage2[0].firstName,
    attendeeNamesPage2[0].lastName,
  ].join(' ');

  // Page 1 signup should be visible.
  screen.getByRole('link', { name: signupName });
  expect(
    screen.queryByRole('link', { name: attendeePage2Name })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  // Page 2 signup should be visible.
  expect(
    await screen.findByRole('link', { name: attendeePage2Name })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: signupName })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  await user.click(page1Button);

  // Page 1 signup should be visible.
  expect(
    await screen.findByRole('link', { name: signupName })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: attendeePage2Name })
  ).not.toBeInTheDocument();
});

test('should open edit signup page by clicking a signup without group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedAttendeesResponse,
  ]);

  const signupLink = await screen.findByRole('link', { name: signupName });
  await user.click(signupLink);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup/edit/${attendees.data[0].id}`
  );
});

test('should open edit signup group page by clicking a signup with group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: attendeesWithGroup }),
  ]);

  const signupLink = await screen.findByRole('link', {
    name: signupName,
  });
  await user.click(signupLink);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test("should display contact person's email and phone number for a signup", async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: attendees }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  const { email, phoneNumber } = attendees.data[0]
    .contactPerson as ContactPerson;
  expect(await withinRow.findByText(email as string)).toBeInTheDocument();
  expect(await withinRow.findByText(phoneNumber as string)).toBeInTheDocument();
});

test("should display contact person's email and phone number for a signup group", async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: attendeesWithGroup }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  const { email, phoneNumber } = signupGroup.contactPerson as ContactPerson;
  expect(await withinRow.findByText(email as string)).toBeInTheDocument();
  expect(await withinRow.findByText(phoneNumber as string)).toBeInTheDocument();
});

test('should display status tag if payment is cancelled', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({
      signupsResponse: attendeesWithPaymentCancellation,
    }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  expect(await withinRow.findByText('Maksua perutaan')).toBeInTheDocument();
});

test('should display status tag if payment is refunded', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: attendeesWithPaymentRefund }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  expect(await withinRow.findByText('Maksua hyvitetään')).toBeInTheDocument();
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({ signupsResponse: attendeesWithGroup }),
  ]);

  const withinRow = within(await findSignupRow(signupName));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa tietoja/i,
  });

  await user.click(editButton);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});
