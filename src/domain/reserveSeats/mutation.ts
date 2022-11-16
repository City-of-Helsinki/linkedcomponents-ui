// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_SEATS_RESERVATION = gql`
  mutation CreateSeatsReservation(
    $input: CreateSeatsReservationMutationInput!
  ) {
    createSeatsReservation(input: $input)
      @rest(
        type: "SeatsReservation"
        path: "/registration/{args.input.registration}/reserve_seats/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...seatsReservationFields
    }
  }

  mutation UpdateSeatsReservation(
    $input: UpdateSeatsReservationMutationInput!
  ) {
    updateSeatsReservation(input: $input)
      @rest(
        type: "SeatsReservation"
        path: "/registration/{args.input.registration}/reserve_seats/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...seatsReservationFields
    }
  }
`;
