// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ORGANIZATION = gql`
  fragment organizationFields on Organization {
    adminUsers {
      ...userFields
    }
    affiliatedOrganizations
    atId
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
    registrationAdminUsers {
      ...userFields
    }
    regularUsers {
      ...userFields
    }
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
    $text: String
  ) {
    organizations(child: $child, page: $page, pageSize: $pageSize, text: $text)
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
