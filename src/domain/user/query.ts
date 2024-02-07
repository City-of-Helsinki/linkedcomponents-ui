// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_USER = gql`
  fragment userFields on User {
    adminOrganizations
    dateJoined
    departmentName
    displayName
    email
    financialAdminOrganizations
    firstName
    isExternal
    isStaff
    isSubstituteUser
    lastLogin
    lastName
    organization
    organizationMemberships
    registrationAdminOrganizations
    username
    uuid
  }

  query User($id: ID!, $createPath: Any) {
    user(id: $id) @rest(type: "User", pathBuilder: $createPath) {
      ...userFields
    }
  }

  query Users($createPath: Any, $page: Int, $pageSize: Int) {
    users(page: $page, pageSize: $pageSize)
      @rest(type: "UsersResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...userFields
      }
    }
  }
`;
