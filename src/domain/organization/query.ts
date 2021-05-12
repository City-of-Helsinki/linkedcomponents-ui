// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ORGANIZATION = gql`
  fragment organizationFields on Organization {
    affiliatedOrganizations
    classification
    createdTime
    dataSource
    dissolutionDate
    foundingDate
    hasRegularUsers
    id
    isAffiliated
    lastModifiedTime
    name
    parentOrganization
    replacedBy
    subOrganizations
  }

  query Organization($id: ID!, $createPath: Any) {
    organization(id: $id)
      @rest(type: "Organization", pathBuilder: $createPath) {
      ...organizationFields
    }
  }

  query Organizations(
    $child: ID
    $createPath: Any
    $page: Int
    $pageSize: Int
  ) {
    organizations(child: $child, page: $page, pageSize: $pageSize)
      @rest(type: "OrganizationsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...organizationFields
      }
    }
  }
`;
