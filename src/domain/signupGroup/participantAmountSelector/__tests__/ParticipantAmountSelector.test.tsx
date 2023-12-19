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
import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../../seatsReservation/constants';
import { SignupServerErrorsProvider } from '../../../signup/signupServerErrorsContext/SignupServerErrorsContext';
import { SIGNUP_INITIAL_VALUES } from '../../constants';
import { SignupGroupFormProvider } from '../../signupGroupFormContext/SignupGroupFormContext';
import ParticipantAmountSelector from '../ParticipantAmountSelector';

afterEach(() => {
  vi.resetAllMocks();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(
    <SignupGroupFormProvider registration={registration}>
      <SignupServerErrorsProvider>
        <Formik
          initialValues={{ signups: [{ ...SIGNUP_INITIAL_VALUES }] }}
          onSubmit={() => undefined}
        >
          <ParticipantAmountSelector
            disabled={false}
            registration={registration}
          />
        </Formik>
      </SignupServerErrorsProvider>
    </SignupGroupFormProvider>,
    { mocks }
  );

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

  const updateSeatsReservationResponse = {
    data: { updateSeatsReservation: seatsReservation },
  };

  return {
    request: {
      query: UpdateSeatsReservationDocument,
      variables: updateSeatsReservationVariables,
    },
    result: updateSeatsReservationResponse,
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
    name: 'Olet ilmoittautumassa tapahtuman jonoon',
  });

  await user.click(within(modal).getByRole('button', { name: 'Sulje' }));

  await waitFor(() => expect(modal).not.toBeInTheDocument());
});
