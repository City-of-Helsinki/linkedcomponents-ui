// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ENROLMENT = gql`
  mutation CreateEnrolment(
    $input: CreateEnrolmentMutationInput!
    $registration: String!
  ) {
    createEnrolment(input: $input, registration: $registration)
      @rest(
        type: "CreateEnrolmentResponse"
        path: "/registration/{args.registration}/signup/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...createEnrolmentFields
    }
  }

  mutation DeleteEnrolment($registration: String!, $signup: String!) {
    deleteEnrolment(registration: $registration, signup: $signup)
      @rest(
        type: "NoContent"
        path: "/registration/{args.registration}/signup/{args.signup}/"
        method: "DELETE"
      ) {
      noContent
    }
  }

  mutation UpdateEnrolment(
    $input: UpdateEnrolmentMutationInput!
    $registration: String!
    $signup: String!
  ) {
    updateEnrolment(
      input: $input
      registration: $registration
      signup: $signup
    )
      @rest(
        type: "Enrolment"
        path: "/registration/{args.registration}/signup/{args.signup}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...enrolmentFields
    }
  }

  mutation SendMessage(
    $input: SendMessageMutationInput!
    $registration: String!
  ) {
    sendMessage(input: $input, registration: $registration)
      @rest(
        type: "SendMessageResponse"
        path: "/registration/{args.registration}/send_message/"
        method: "POST"
        bodyKey: "input"
      ) {
      htmlMessage
      message
      signups
      subject
    }
  }
`;
