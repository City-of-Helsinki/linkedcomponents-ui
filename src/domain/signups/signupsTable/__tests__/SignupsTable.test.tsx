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
  heading: 'Signups table',
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

test('should render signups table', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(fakeSignups(0)),
  ]);

  screen.getByRole('heading', { name: 'Signups table' });

  const columnHeaders = ['Nimi', 'Sähköposti', 'Puhelinnumero', 'Status'];

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
  screen.getByRole('button', { name: signupName });
  expect(
    screen.queryByRole('button', { name: attendeePage2Name })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  // Page 2 signup should be visible.
  expect(
    await screen.findByRole('button', { name: attendeePage2Name })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: signupName })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  await user.click(page1Button);

  // Page 1 signup should be visible.
  expect(screen.getByRole('button', { name: signupName })).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: attendeePage2Name })
  ).not.toBeInTheDocument();
});

test('signup name should work as a link to edit signup page', async () => {
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

test('should open edit signup page by clicking a signup without group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedAttendeesResponse,
  ]);

  const signupButton = await screen.findByRole('button', { name: signupName });
  await user.click(signupButton);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup/edit/${attendees.data[0].id}`
  );
});

test('signup group name should work as a link to edit signup group page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  const signupLink = await screen.findByRole('link', { name: signupName });
  await user.click(signupLink);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test('should open edit signup group page by clicking a signup with group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.click(signupButton);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test('should open edit signup page by pressing enter on a signup without group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedAttendeesResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.type(signupButton, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup/edit/${attendees.data[0].id}`
  );
});

test('should open edit signup group page by pressing enter on a signup with group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.type(signupButton, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test('should display email and phone number for a signup', async () => {
  renderComponent([...defaultMocks, getMockedAttendeesResponse(attendees)]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  const { email, phoneNumber } = attendees.data[0]
    .contactPerson as ContactPerson;
  expect(
    await within(signupButton).findByText(email as string)
  ).toBeInTheDocument();
  expect(
    await within(signupButton).findByText(phoneNumber as string)
  ).toBeInTheDocument();
});

test('should display email and phone number for a signup group', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  const { email, phoneNumber } = signupGroup.contactPerson as ContactPerson;
  expect(
    await within(signupButton).findByText(email as string)
  ).toBeInTheDocument();
  expect(
    await within(signupButton).findByText(phoneNumber as string)
  ).toBeInTheDocument();
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  const withinRow = within(
    await screen.findByRole('button', { name: signupName })
  );
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
