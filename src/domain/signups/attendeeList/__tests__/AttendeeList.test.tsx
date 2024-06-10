import { MockedResponse } from '@apollo/client/testing';

import {
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
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
  attendeesWithPaymentCancellation,
  attendeesWithPaymentRefund,
  getMockedAttendeesResponse,
} from '../../__mocks__/signupsPage';
import AttendeeList, { AttendeeListProps } from '../AttendeeList';

configure({ defaultHidden: true });

afterEach(() => {
  vi.runOnlyPendingTimers();
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
    }),
  ]);

  await loadingSpinnerIsNotInDocument();
  const withinRow = within(await findSignupRow(signupName));
  expect(await withinRow.findByText('Maksua perutaan')).toBeInTheDocument();

  vi.advanceTimersByTime(31000);

  expect(await withinRow.findByText('Maksua hyvitetään')).toBeInTheDocument();
});
