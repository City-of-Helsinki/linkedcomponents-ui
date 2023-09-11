/* eslint-disable @typescript-eslint/no-require-imports */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  CreateSeatsReservationDocument,
  SeatsReservation,
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
import { registration } from '../../../registration/__mocks__/registration';
import { SignupPageProvider } from '../../../signup/signupPageContext/SignupPageContext';
import {
  SignupServerErrorsContext,
  SignupServerErrorsContextProps,
} from '../../../signup/signupServerErrorsContext/SignupServerErrorsContext';
import ReservationTimer from '../ReservationTimer';

const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const defaultServerErrorsProps: SignupServerErrorsContextProps = {
  serverErrorItems: [],
  setServerErrorItems: jest.fn(),
  showServerErrors: jest.fn(),
};

const payload = {
  registration: registration.id,
  seats: 1,
};

const createSeatsReservationVariables = { input: payload };

const renderComponent = (
  serverErrorProps?: Partial<SignupServerErrorsContextProps>,
  mocks: MockedResponse[] = []
) =>
  render(
    <SignupPageProvider>
      <SignupServerErrorsContext.Provider
        value={{ ...defaultServerErrorsProps, ...serverErrorProps }}
      >
        <ReservationTimer
          callbacksDisabled={false}
          disableCallbacks={jest.fn()}
          initReservationData={true}
          registration={registration}
          setSignups={jest.fn()}
          signups={[]}
        />
      </SignupServerErrorsContext.Provider>
    </SignupPageProvider>,
    { mocks }
  );

beforeEach(() => {
  jest.resetAllMocks();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const getSeatsReservationErrorMock = (error: Error): MockedResponse => {
  return {
    request: {
      query: CreateSeatsReservationDocument,
      variables: createSeatsReservationVariables,
    },
    error,
  };
};

const createSeatsReservationPayload = {
  registration: registration.id,
  seats: 1,
};

const getCreateSeatsReservationMock = (
  seatsReservation: SeatsReservation
): MockedResponse => {
  const createSeatsReservationVariables = {
    input: { ...createSeatsReservationPayload, seats: seatsReservation.seats },
  };

  const createSeatsReservationResponse = {
    data: { createSeatsReservation: seatsReservation },
  };

  return {
    request: {
      query: CreateSeatsReservationDocument,
      variables: createSeatsReservationVariables,
    },
    result: createSeatsReservationResponse,
  };
};

test('should show server errors when creating seats reservation fails', async () => {
  const showServerErrors = jest.fn();
  const error = new Error();
  const mocks = [getSeatsReservationErrorMock(error)];
  renderComponent({ showServerErrors }, mocks);

  await waitFor(() =>
    expect(showServerErrors).toBeCalledWith({ error }, 'seatsReservation')
  );
});

test('should show modal if any of the reserved seats is in waiting list', async () => {
  const user = userEvent.setup();
  const mocks = [
    getCreateSeatsReservationMock(
      fakeSeatsReservation({ seats: 1, inWaitlist: true })
    ),
  ];
  renderComponent(undefined, mocks);

  const modal = await screen.findByRole(
    'dialog',
    { name: 'Ilmoittautujia on lisätty varausjonoon' },
    { timeout: 10000 }
  );

  await user.click(within(modal).getByRole('button', { name: 'Sulje' }));

  await waitFor(() => expect(modal).not.toBeInTheDocument());
});

test('should route to create signup page if reservation is expired', async () => {
  const user = userEvent.setup();

  setSessionStorageValues(getMockedSeatsReservationData(-1000), registration);

  renderComponent();
  const modal = await screen.findByRole(
    'dialog',
    { name: 'Varausaika on täynnä.' },
    { timeout: 5000 }
  );
  const tryAgainButton = within(modal).getByRole('button', {
    name: 'Yritä uudelleen',
  });

  await user.click(tryAgainButton);

  await waitFor(() => expect(mockedUseNavigate).toBeCalledWith(0));
});
