import React from 'react';

import { RegistrationFieldsFragment } from '../../../../../generated/graphql';
import { fakeRegistration } from '../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../utils/testUtils';
import AvailableSeatsText from '../AvailableSeatsText';

configure({ defaultHidden: true });

const renderComponent = (registration: RegistrationFieldsFragment) =>
  render(<AvailableSeatsText registration={registration} />);

test('should show amount of free seats ', () => {
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

test('should show amount of remaining seats ', () => {
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
