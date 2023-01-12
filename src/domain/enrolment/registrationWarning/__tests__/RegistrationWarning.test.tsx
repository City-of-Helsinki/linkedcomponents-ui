import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';

import { RegistrationFieldsFragment } from '../../../../generated/graphql';
import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import RegistrationWarning from '../RegistrationWarning';

const renderComponent = (registration: RegistrationFieldsFragment) =>
  render(<RegistrationWarning registration={registration} />);

test('should show warning if registration is full', async () => {
  const now = new Date();
  const enrolmentStartTime = subDays(now, 1).toISOString();
  const enrolmentEndTime = addDays(now, 1).toISOString();
  const registration = fakeRegistration({
    currentAttendeeCount: 10,
    currentWaitingListCount: 5,
    enrolmentEndTime,
    enrolmentStartTime,
    maximumAttendeeCapacity: 10,
    waitingListCapacity: 5,
  });

  renderComponent(registration);

  screen.getByText(
    'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
  );
});
