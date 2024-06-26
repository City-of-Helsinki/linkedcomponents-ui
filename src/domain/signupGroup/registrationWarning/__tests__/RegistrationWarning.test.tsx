import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { RegistrationFieldsFragment } from '../../../../generated/graphql';
import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import { render, screen } from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import RegistrationWarning from '../RegistrationWarning';

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const renderComponent = (registration: RegistrationFieldsFragment) =>
  render(<RegistrationWarning registration={registration} />, { mocks });

const now = new Date();
const enrolmentStartTime = subDays(now, 1).toISOString();
const enrolmentEndTime = addDays(now, 1).toISOString();
const registration = fakeRegistration({
  currentAttendeeCount: 10,
  currentWaitingListCount: 5,
  enrolmentEndTime,
  enrolmentStartTime,
  id: TEST_REGISTRATION_ID,
  maximumAttendeeCapacity: 10,
  waitingListCapacity: 5,
});

afterAll(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test('should show warning if registration is full', async () => {
  renderComponent(registration);

  screen.getByText(
    'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
  );
});

test('should not show warning if registration is full but user has reservation', async () => {
  const reservation = getMockedSeatsReservationData(1000);
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  expect(
    screen.queryByText(
      'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
    )
  ).not.toBeInTheDocument();
});
