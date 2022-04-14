// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_IMAGE = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id)
      @rest(type: "NoContent", path: "/image/{args.id}/", method: "DELETE") {
      noContent
    }
  }

  mutation UpdateImage($input: UpdateImageMutationInput!) {
    updateImage(input: $input)
      @rest(
        type: "Image"
        path: "/image/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...imageFields
    }
  }
  mutation UploadImage($input: UploadImageMutationInput!) {
    uploadImage(input: $input)
      @rest(
        type: "Image"
        path: "/image/"
        method: "POST"
        bodySerializer: "uploadImageSerializer"
      ) {
      ...imageFields
    }
  }
`;
