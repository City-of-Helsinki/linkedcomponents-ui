/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import {
  SeatsReservation,
  UpdateSeatsReservationDocument,
} from '../../../../generated/graphql';
import {
  fakeSeatsReservation,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { EnrolmentServerErrorsProvider } from '../../../enrolment/enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import { registration } from '../../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../../seatsReservation/constants';
import { SignupPageProvider } from '../../../signup/signupPageContext/SignupPageContext';
import { SIGNUP_INITIAL_VALUES } from '../../constants';
import ParticipantAmountSelector from '../ParticipantAmountSelector';

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(
    <SignupPageProvider>
      <EnrolmentServerErrorsProvider>
        <Formik
          initialValues={{ signups: [{ ...SIGNUP_INITIAL_VALUES }] }}
          onSubmit={() => undefined}
        >
          <ParticipantAmountSelector
            disabled={false}
            registration={registration}
          />
        </Formik>
      </EnrolmentServerErrorsProvider>
    </SignupPageProvider>,
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

const code = TEST_SEATS_RESERVATION_CODE;

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

  const reservation = getMockedSeatsReservationData(1000);
  setSessionStorageValues(reservation, registration);

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
