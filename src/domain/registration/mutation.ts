// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_REGISTRATION = gql`
  mutation CreateRegistration($input: CreateRegistrationMutationInput!) {
    createRegistration(input: $input)
      @rest(
        type: "Registration"
        path: "/registration/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...registrationFields
    }
  }

  mutation DeleteRegistration($id: ID!) {
    deleteRegistration(id: $id)
      @rest(
        type: "NoContent"
        path: "/registration/{args.id}/"
        method: "DELETE"
      ) {
      noContent
    }
  }

  mutation UpdateRegistration(
    $id: ID!
    $input: UpdateRegistrationMutationInput!
  ) {
    updateRegistration(id: $id, input: $input)
      @rest(
        type: "Registration"
        path: "/registration/{args.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...registrationFields
    }
  }
`;
