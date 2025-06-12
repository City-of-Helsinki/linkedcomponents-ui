// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ORGANIZATION = gql`
  fragment webStoreAccountFields on WebStoreAccount {
    active
    balanceProfitCenter
    companyCode
    id
    internalOrder
    mainLedgerAccount
    name
    operationArea
    profitCenter
    project
  }

  fragment webStoreMerchantFields on WebStoreMerchant {
    active
    businessId
    city
    email
    id
    merchantId
    name
    paytrailMerchantId
    phoneNumber
    streetAddress
    termsOfServiceUrl
    zipcode
  }

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
    financialAdminUsers {
      ...userFields
    }
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
    webStoreAccounts {
      ...webStoreAccountFields
    }
    webStoreMerchants {
      ...webStoreMerchantFields
    }
  }

  query OrganizationMerchants($id: ID!) {
    organizationMerchants(id: $id)
      @rest(
        type: "[WebStoreMerchant]"
        path: "/organization/{args.id}/merchants/"
      ) {
      ...webStoreMerchantFields
    }
  }

  query OrganizationAccounts($id: ID!) {
    organizationAccounts(id: $id)
      @rest(
        type: "[WebStoreAccount]"
        path: "/organization/{args.id}/accounts/"
      ) {
      ...webStoreAccountFields
    }
  }

  query Organization($id: ID!, $createPath: Any, $dissolved: Boolean) {
    organization(id: $id, dissolved: $dissolved)
      @rest(type: "Organization", pathBuilder: $createPath) {
      ...organizationFields
    }
  }

  query Organizations(
    $child: ID
    $createPath: Any
    $page: Int
    $pageSize: Int
    $parent: ID
    $dissolved: Boolean
    $text: String
  ) {
    organizations(
      child: $child
      page: $page
      pageSize: $pageSize
      parent: $parent
      dissolved: $dissolved
      text: $text
    ) @rest(type: "OrganizationsResponse", pathBuilder: $createPath) {
      meta {
        ...metaFields
      }
      data {
        ...organizationFields
      }
    }
  }
`;
