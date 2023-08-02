// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_IMAGE = gql`
  fragment imageFields on Image {
    id
    atId
    altText {
      ...localisedFields
    }
    lastModifiedTime
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
    $createdBy: String
    $dataSource: String
    $mergePages: Boolean
    $page: Int
    $pageSize: Int
    $publisher: ID
    $sort: String
    $text: String
    $createPath: Any
  ) {
    images(
      createdBy: $createdBy
      dataSource: $dataSource
      mergePages: $mergePages
      page: $page
      pageSize: $pageSize
      publisher: $publisher
      sort: $sort
      text: $text
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
