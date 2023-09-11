// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_SEATS_RESERVATION = gql`
  mutation CreateSeatsReservation(
    $input: CreateSeatsReservationMutationInput!
  ) {
    createSeatsReservation(input: $input)
      @rest(
        type: "SeatsReservation"
        path: "/seats_reservation/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...seatsReservationFields
    }
  }

  mutation UpdateSeatsReservation(
    $id: ID!
    $input: UpdateSeatsReservationMutationInput!
  ) {
    updateSeatsReservation(id: $id, input: $input)
      @rest(
        type: "SeatsReservation"
        path: "/seats_reservation/{args.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...seatsReservationFields
    }
  }
`;
