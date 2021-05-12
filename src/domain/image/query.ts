// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_IMAGE = gql`
  fragment imageFields on Image {
    id
    atId
    altText
    license
    name
    photographerName
    publisher
    url
  }

  query Image($id: ID!, $createPath: Any) {
    image(id: $id) @rest(type: "Image", pathBuilder: $createPath) {
      ...imageFields
    }
  }

  query Images(
    $dataSource: String
    $page: Int
    $pageSize: Int
    $publisher: ID
    $createPath: Any
  ) {
    images(
      dataSource: $dataSource
      page: $page
      pageSize: $pageSize
      publisher: $publisher
    ) @rest(type: "ImagesResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...imageFields
      }
    }
  }
`;
