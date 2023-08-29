// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_ENROLMENT = gql`
  mutation CreateSignupGroup($input: CreateSignupGroupMutationInput!) {
    createSignupGroup(input: $input)
      @rest(
        type: "CreateSignupGroupResponse"
        path: "/signup_group/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...createSignupGroupFields
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
        type: "Signup"
        path: "/signup/{args.signup}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...signupFields
    }
  }

  mutation PatchEnrolment(
    $input: UpdateEnrolmentMutationInput!
    $signup: String!
  ) {
    updateEnrolment(input: $input, signup: $signup)
      @rest(
        type: "Signup"
        path: "/signup/{args.signup}/"
        method: "PATCH"
        bodyKey: "input"
      ) {
      ...signupFields
    }
  }

  mutation SendMessage($input: SendMessageMutationInput!, $registration: ID!) {
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
