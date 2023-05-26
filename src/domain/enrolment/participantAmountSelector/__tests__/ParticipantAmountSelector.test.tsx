/* eslint-disable @typescript-eslint/no-require-imports */
import { MockedResponse } from '@apollo/client/testing';
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import { Formik } from 'formik';
import React from 'react';

import { RESERVATION_NAMES } from '../../../../constants';
import {
  SeatsReservation,
  UpdateSeatsReservationDocument,
} from '../../../../generated/graphql';
import { fakeSeatsReservation } from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../../reserveSeats/constants';
import { ATTENDEE_INITIAL_VALUES } from '../../constants';
import { EnrolmentPageProvider } from '../../enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from '../../enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import ParticipantAmountSelector from '../ParticipantAmountSelector';

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(
    <EnrolmentPageProvider>
      <EnrolmentServerErrorsProvider>
        <Formik
          initialValues={{ attendees: [{ ...ATTENDEE_INITIAL_VALUES }] }}
          onSubmit={() => undefined}
        >
          <ParticipantAmountSelector
            disabled={false}
            registration={registration}
          />
        </Formik>
      </EnrolmentServerErrorsProvider>
    </EnrolmentPageProvider>,
    { mocks }
  );

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const getElement = (
  key: 'participantAmountInput' | 'updateParticipantAmountButton'
) => {
  switch (key) {
    case 'participantAmountInput':
      return screen.getByRole('spinbutton', {
        name: /ilmoittautujien määrä \*/i,
      });
    case 'updateParticipantAmountButton':
      return screen.getByRole('button', { name: /päivitä/i });
  }
};

const setSessionStorageValues = (reservation: SeatsReservation) => {
  jest.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => {
    switch (key) {
      case `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registration.id}`:
        return reservation ? JSON.stringify(reservation) : '';
      default:
        return '';
    }
  });
};

const code = TEST_SEATS_RESERVATION_CODE;

const getReservationData = (expirationOffset: number) => {
  const now = new Date();
  let expiration = '';

  if (expirationOffset) {
    expiration = addSeconds(now, expirationOffset).toISOString();
  } else {
    expiration = subSeconds(now, expirationOffset).toISOString();
  }

  const reservation = fakeSeatsReservation({ code, expiration });

  return reservation;
};

const getUpdateSeatsReservationMock = (
  seatsReservation: SeatsReservation
): MockedResponse => {
  const updateSeatsReservationVariables = {
    id: seatsReservation.id,
    input: {
      code,
      registration: registration.id,
      seats: seatsReservation.seats,
    },
  };

  const updateEnrolmentResponse = {
    data: { updateSeatsReservation: seatsReservation },
  };

  return {
    request: {
      query: UpdateSeatsReservationDocument,
      variables: updateSeatsReservationVariables,
    },
    result: updateEnrolmentResponse,
  };
};

test('should show modal if the reserved seats are in waiting list', async () => {
  const user = userEvent.setup();

  const reservation = getReservationData(1000);
  setSessionStorageValues(reservation);

  const mocks = [
    getUpdateSeatsReservationMock(
      fakeSeatsReservation({ id: reservation.id, seats: 2, inWaitlist: true })
    ),
  ];
  renderComponent(mocks);

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
    'updateParticipantAmountButton'
  );

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '2');
  await user.click(updateParticipantAmountButton);

  const modal = await screen.findByRole('dialog', {
    name: 'Ilmoittautujia on lisätty varausjonoon',
  });

  await user.click(within(modal).getByRole('button', { name: 'Sulje' }));

  await waitFor(() => expect(modal).not.toBeInTheDocument());
});
