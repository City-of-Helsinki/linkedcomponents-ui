// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ENROLMENT = gql`
  mutation CreateEnrolment($input: CreateEnrolmentMutationInput!) {
    createEnrolment(input: $input)
      @rest(
        type: "Enrolment"
        path: "/signup/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...enrolmentFields
    }
  }

  mutation UpdateEnrolment($input: UpdateEnrolmentMutationInput!) {
    updateEnrolment(input: $input)
      @rest(
        type: "Enrolment"
        path: "/signup_edit/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...enrolmentFields
    }
  }
`;
