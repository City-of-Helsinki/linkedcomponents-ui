// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ORGANIZATION_CLASS = gql`
  fragment organizationClassFields on OrganizationClass {
    createdTime
    dataSource
    id
    lastModifiedTime
    name
  }

  query OrganizationClass($id: ID!, $createPath: Any) {
    organizationClass(id: $id)
      @rest(type: "OrganizationClass", pathBuilder: $createPath) {
      ...organizationClassFields
    }
  }

  query OrganizationClasses($createPath: Any, $page: Int, $pageSize: Int) {
    organizationClasses(page: $page, pageSize: $pageSize)
      @rest(type: "OrganizationClassesResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...organizationClassFields
      }
    }
  }
`;
