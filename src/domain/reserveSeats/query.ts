// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SEATS_RESERVATION = gql`
  fragment seatsReservationFields on SeatsReservation {
    id
    code
    expiration
    inWaitlist
    registration
    seats
    timestamp
  }
`;
