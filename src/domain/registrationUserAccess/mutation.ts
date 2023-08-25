// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_REGISTRATION_USER = gql`
  mutation SendRegistrationUserAccessInvitation($id: Int!) {
    sendRegistrationUserAccessInvitation(id: $id)
      @rest(
        type: "NoContent"
        path: "/registration_user_access/{args.id}/send_invitation/"
        method: "POST"
        bodyKey: "id"
      ) {
      noContent
    }
  }
`;
