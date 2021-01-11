import gql from 'graphql-tag';

export const MUTATION_IMAGE = gql`
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
