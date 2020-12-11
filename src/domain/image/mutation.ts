import gql from 'graphql-tag';

export const MUTATION_IMAGE = gql`
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
