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

  mutation UpdateRegistration($input: UpdateRegistrationMutationInput!) {
    updateRegistration(input: $input)
      @rest(
        type: "Registration"
        path: "/registration/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...registrationFields
    }
  }
`;
