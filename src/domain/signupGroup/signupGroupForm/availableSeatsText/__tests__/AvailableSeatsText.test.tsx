import React from 'react';

import { RegistrationFieldsFragment } from '../../../../../generated/graphql';
import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../utils/testUtils';
import { TEST_REGISTRATION_ID } from '../../../../registration/constants';
import AvailableSeatsText from '../AvailableSeatsText';

configure({ defaultHidden: true });

const renderComponent = (registration: RegistrationFieldsFragment) =>
  render(<AvailableSeatsText registration={registration} />);

test('should show amount of free seats', () => {
  renderComponent(
    fakeRegistration({
      maximumAttendeeCapacity: 10,
      currentAttendeeCount: 3,
      remainingAttendeeCapacity: 7,
    })
  );

  screen.getByText('Saatavilla olevia paikkoja');
  screen.getByText('7');
});

test('should show amount of remaining seats', () => {
  renderComponent(
    fakeRegistration({
      maximumAttendeeCapacity: 10,
      currentAttendeeCount: 3,
      remainingAttendeeCapacity: 0,
    })
  );

  screen.getByText('Saatavilla olevia paikkoja');
  screen.getByText('0');
});

test('should show amount of remaining seats if there ia reservation stored to session storage', () => {
  const reservation = getMockedSeatsReservationData(1000);
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    maximumAttendeeCapacity: 10,
    currentAttendeeCount: 3,
    remainingAttendeeCapacity: 0,
  });
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  screen.getByText('Saatavilla olevia paikkoja');
  screen.getByText(reservation.seats);
});

test('should show amount of free waiting list seats', () => {
  renderComponent(
    fakeRegistration({
      maximumAttendeeCapacity: 10,
      currentAttendeeCount: 10,
      currentWaitingListCount: 3,
      remainingAttendeeCapacity: 0,
      remainingWaitingListCapacity: 7,
      waitingListCapacity: 10,
    })
  );

  screen.getByText('Saatavilla olevia jonopaikkoja');
  screen.getByText('7');
});

test('should show amount of remaining waiting list seats ', () => {
  renderComponent(
    fakeRegistration({
      maximumAttendeeCapacity: 10,
      currentAttendeeCount: 10,
      currentWaitingListCount: 3,
      remainingAttendeeCapacity: 0,
      remainingWaitingListCapacity: 0,
      waitingListCapacity: 10,
    })
  );

  screen.getByText('Saatavilla olevia jonopaikkoja');
  screen.getByText('0');
});

test('should show amount of remaining waiting list seats if there ia reservation stored to session storage', () => {
  const reservation = getMockedSeatsReservationData(1000);
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    maximumAttendeeCapacity: 10,
    currentAttendeeCount: 10,
    currentWaitingListCount: 3,
    remainingAttendeeCapacity: 0,
    remainingWaitingListCapacity: 0,
    waitingListCapacity: 10,
  });
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  screen.getByText('Saatavilla olevia jonopaikkoja');
  screen.getByText(reservation.seats);
});
