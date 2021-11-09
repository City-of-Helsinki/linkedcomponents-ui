// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ENROLMENT = gql`
  mutation CreateEnrolment($input: CreateEnrolmentMutationInput!) {
    createEnrolment(input: $input)
      @rest(
        type: "Enrolment"
        path: "/enrolment/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...enrolmentFields
    }
  }
`;
