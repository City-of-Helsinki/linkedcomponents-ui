import isPast from 'date-fns/isPast';

import { RESERVATION_NAMES } from '../../constants';
import { SeatsReservation } from '../../generated/graphql';
import getUnixTime from '../../utils/getUnixTime';

export const getSeatsReservationData = (
  registrationId: string
): SeatsReservation | null => {
  const data = sessionStorage?.getItem(
    `${RESERVATION_NAMES.SEATS_RESERVATION}-${registrationId}`
  );

  return data ? JSON.parse(data) : null;
};

export const setSeatsReservationData = (
  registrationId: string,
  seatsReservation: SeatsReservation
): void => {
  sessionStorage?.setItem(
    `${RESERVATION_NAMES.SEATS_RESERVATION}-${registrationId}`,
    JSON.stringify(seatsReservation)
  );
};

export const clearSeatsReservationData = (registrationId: string): void => {
  sessionStorage?.removeItem(
    `${RESERVATION_NAMES.SEATS_RESERVATION}-${registrationId}`
  );
};

export const isSeatsReservationExpired = (data: SeatsReservation): boolean => {
  return !data.expiration || isPast(new Date(data.expiration));
};

export const getRegistrationTimeLeft = (
  data: SeatsReservation | null
): number => {
  const now = new Date();

  return data?.expiration
    ? getUnixTime(new Date(data.expiration)) - getUnixTime(now)
    : 0;
};
