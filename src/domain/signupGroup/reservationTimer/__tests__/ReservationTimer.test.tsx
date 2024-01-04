/* eslint-disable @typescript-eslint/no-require-imports */
import { ApolloError } from '@apollo/client';
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
import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import {
  SignupServerErrorsContext,
  SignupServerErrorsContextProps,
} from '../../../signup/signupServerErrorsContext/SignupServerErrorsContext';
import { SignupGroupFormProvider } from '../../signupGroupFormContext/SignupGroupFormContext';
import ReservationTimer from '../ReservationTimer';

const mockedUseNavigate = vi.fn();

vi.mock('react-router', async () => {
  return {
    ...((await vi.importActual('react-router')) as object),
    useNavigate: () => mockedUseNavigate,
  };
});

afterEach(() => {
  vi.resetAllMocks();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const defaultServerErrorsProps: SignupServerErrorsContextProps = {
  serverErrorItems: [],
  setServerErrorItems: vi.fn(),
  showServerErrors: vi.fn(),
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
    <SignupGroupFormProvider registration={registration}>
      <SignupServerErrorsContext.Provider
        value={{ ...defaultServerErrorsProps, ...serverErrorProps }}
      >
        <ReservationTimer
          callbacksDisabled={false}
          disableCallbacks={vi.fn()}
          initReservationData={true}
          registration={registration}
          setSignups={vi.fn()}
          signups={[]}
        />
      </SignupServerErrorsContext.Provider>
    </SignupGroupFormProvider>,
    { mocks }
  );

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
  const showServerErrors = vi.fn();
  const error = new ApolloError({ errorMessage: 'Error' });
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
    { name: 'Olet ilmoittautumassa tapahtuman jonoon' },
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
