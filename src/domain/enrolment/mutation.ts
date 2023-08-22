// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ENROLMENT = gql`
  mutation CreateEnrolment($input: CreateEnrolmentMutationInput!) {
    createEnrolment(input: $input)
      @rest(
        type: "CreateEnrolmentResponse"
        path: "/signup/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...createEnrolmentFields
    }
  }

  mutation DeleteEnrolment($signup: String!) {
    deleteEnrolment(signup: $signup)
      @rest(
        type: "NoContent"
        path: "/signup/{args.signup}/"
        method: "DELETE"
      ) {
      noContent
    }
  }

  mutation UpdateEnrolment(
    $input: UpdateEnrolmentMutationInput!
    $signup: String!
  ) {
    updateEnrolment(input: $input, signup: $signup)
      @rest(
        type: "Enrolment"
        path: "/signup/{args.signup}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...enrolmentFields
    }
  }

  mutation PatchEnrolment(
    $input: UpdateEnrolmentMutationInput!
    $signup: String!
  ) {
    updateEnrolment(input: $input, signup: $signup)
      @rest(
        type: "Enrolment"
        path: "/signup/{args.signup}/"
        method: "PATCH"
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
