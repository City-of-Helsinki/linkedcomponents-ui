import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';

import { RegistrationFieldsFragment } from '../../../../generated/graphql';
import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import RegistrationWarning from '../RegistrationWarning';

const renderComponent = (registration: RegistrationFieldsFragment) =>
  render(<RegistrationWarning registration={registration} />);

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

test('should show warning if registration is full', async () => {
  renderComponent(registration);

  await screen.getByText(
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
