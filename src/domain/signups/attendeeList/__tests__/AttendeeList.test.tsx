import { MockedResponse } from '@apollo/client/testing';

import { AttendeeStatus } from '../../../../generated/graphql';
import {
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import { mockedSignupGroupResponse } from '../../../signupGroup/__mocks__/editSignupGroupPage';
import { SignupGroupFormProvider } from '../../../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import {
  attendeeNames,
  attendeesWithMultipleStatuses,
  attendeesWithPaymentCancellation,
  attendeesWithPaymentRefund,
  awaitingPaymentAttendeeNames,
  awaitingPaymentAttendees,
  getMockedAttendeesResponse,
} from '../../__mocks__/signupsPage';
import AttendeeList, { AttendeeListProps } from '../AttendeeList';

configure({ defaultHidden: true });

afterEach(() => {
  act(() => {
    vi.runOnlyPendingTimers();
  });
  vi.useRealTimers();
  vi.resetAllMocks();
});

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationAncestorsResponse,
  mockedSignupGroupResponse,
  mockedUserResponse,
];

const registrationWithPriceGroups = fakeRegistration({
  id: TEST_REGISTRATION_ID,
  registrationPriceGroups: [
    fakeRegistrationPriceGroup({ id: 1, price: '10.00' }),
  ],
});

const defaultProps: AttendeeListProps = {
  registration: registrationWithPriceGroups,
};

const signupName = [attendeeNames[0].firstName, attendeeNames[0].lastName].join(
  ' '
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) => {
  return render(
    <SignupGroupFormProvider registration={registrationWithPriceGroups}>
      <AttendeeList {...defaultProps} />
    </SignupGroupFormProvider>,
    { mocks }
  );
};

const findSignupRow = async (name: string) =>
  (await screen.findByRole('link', { name })).parentElement?.parentElement
    ?.parentElement as HTMLElement;

test('should refetch signups data after 30 seconds', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({
      signupsResponse: attendeesWithPaymentCancellation,
      refetchSignupsResponse: attendeesWithPaymentRefund,
      overrideVariables: {
        attendeeStatus: [
          AttendeeStatus.Attending,
          AttendeeStatus.AwaitingPayment,
        ],
      },
    }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  expect(await withinRow.findByText('Maksua perutaan')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(31000);
  });

  expect(await withinRow.findByText('Maksua hyvitetään')).toBeInTheDocument();
});

test('should query signups with both Attending and AwaitingPayment statuses', async () => {
  const mockResponse = getMockedAttendeesResponse({
    signupsResponse: attendeesWithMultipleStatuses,
    overrideVariables: {
      attendeeStatus: [
        AttendeeStatus.Attending,
        AttendeeStatus.AwaitingPayment,
      ],
    },
  });

  renderComponent([...defaultMocks, mockResponse]);

  await loadingSpinnerIsNotInDocument();

  // Verify the mock was consumed by checking that the data from attendeesWithMultipleStatuses is displayed
  // This proves the query was made with the correct variables, as only that specific mock would return this data
  expect(await screen.findByText('Attending User 1')).toBeInTheDocument();
  expect(await screen.findByText('Awaiting Payment 1')).toBeInTheDocument();
  expect(await screen.findByText('Attending User 2')).toBeInTheDocument();
  expect(await screen.findByText('Awaiting Payment 2')).toBeInTheDocument();
});

test('should display signups with AwaitingPayment status', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({
      signupsResponse: awaitingPaymentAttendees,
      overrideVariables: {
        attendeeStatus: [
          AttendeeStatus.Attending,
          AttendeeStatus.AwaitingPayment,
        ],
      },
    }),
  ]);

  await loadingSpinnerIsNotInDocument();

  const awaitingPaymentName = [
    awaitingPaymentAttendeeNames[0].firstName,
    awaitingPaymentAttendeeNames[0].lastName,
  ].join(' ');
  expect(await screen.findByText(awaitingPaymentName)).toBeInTheDocument();
});

test('should display correct status text for awaiting_payment', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse({
      signupsResponse: awaitingPaymentAttendees,
      overrideVariables: {
        attendeeStatus: [
          AttendeeStatus.Attending,
          AttendeeStatus.AwaitingPayment,
        ],
      },
    }),
  ]);

  await loadingSpinnerIsNotInDocument();

  const awaitingPaymentName = [
    awaitingPaymentAttendeeNames[0].firstName,
    awaitingPaymentAttendeeNames[0].lastName,
  ].join(' ');
  const withinRow = within(await findSignupRow(awaitingPaymentName));
  expect(await withinRow.findByText('Odottaa maksua')).toBeInTheDocument();
});
