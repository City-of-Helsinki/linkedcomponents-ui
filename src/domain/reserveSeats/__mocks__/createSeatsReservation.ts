import { CreateSeatsReservationDocument } from '../../../generated/graphql';
import { fakeSeatsReservation } from '../../../utils/mockDataUtils';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../constants';

const code = TEST_SEATS_RESERVATION_CODE;
const seatsReservation = fakeSeatsReservation({ code });
const seats = 1;

const createSeatsReservationPayload = {
  registration: TEST_REGISTRATION_ID,
  seats,
};
const createSeatsReservationVariables = {
  input: createSeatsReservationPayload,
};

const createEnrolmentResponse = {
  data: {
    createSeatsReservation: {
      ...seatsReservation,
      seats,
      seatsAtEvent: seats,
    },
  },
};

const mockedCreateSeatsReservationResponse = {
  request: {
    query: CreateSeatsReservationDocument,
    variables: createSeatsReservationVariables,
  },
  result: createEnrolmentResponse,
};

export { mockedCreateSeatsReservationResponse };
