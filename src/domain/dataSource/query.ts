// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_DATA_SOURCE = gql`
  fragment dataSourceFields on DataSource {
    apiKey
    createPastEvents
    editPastEvents
    id
    name
    owner
    private
    userEditable
  }

  query DataSource($id: ID!, $createPath: Any) {
    dataSource(id: $id) @rest(type: "DataSource", pathBuilder: $createPath) {
      ...dataSourceFields
    }
  }

  query DataSources($createPath: Any, $page: Int, $pageSize: Int) {
    dataSources(page: $page, pageSize: $pageSize)
      @rest(type: "DataSourcesResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...dataSourceFields
      }
    }
  }
`;
