// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_REGISTRATION_USER = gql`
  mutation SendRegistrationUserInvitation($id: Int!) {
    sendRegistrationUserInvitation(id: $id)
      @rest(
        type: "NoContent"
        path: "/registration_user/{args.id}/send_invitation/"
        method: "POST"
        bodyKey: "id"
      ) {
      noContent
    }
  }
`;
