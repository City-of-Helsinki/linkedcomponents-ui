// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_SIGNUP = gql`
  mutation DeleteSignup($id: ID!) {
    deleteSignup(id: $id)
      @rest(type: "NoContent", path: "/signup/{args.id}/", method: "DELETE") {
      noContent
    }
  }

  mutation UpdateSignup($input: UpdateSignupMutationInput!, $id: ID!) {
    updateSignup(input: $input, id: $id)
      @rest(
        type: "Signup"
        path: "/signup/{args.signup}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...signupFields
    }
  }

  mutation PatchSignup($input: UpdateSignupMutationInput!, $id: ID!) {
    updateSignup(input: $input, id: $id)
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
