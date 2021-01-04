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
`;
