// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentFields on Enrolment {
    id
    atId
    city
    email
    extraInfo
    membershipNumber
    name
    nativeLanguage
    notificationLanguage
    notifications
    organizationName
    phoneNumber
    serviceLanguage
    streetAddress
    yearOfBirth
    zip
  }
`;
