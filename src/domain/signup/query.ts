// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_SIGNUP = gql`
  query Signup($id: ID!) {
    signup(id: $id)
      @rest(type: "Signup", path: "/signup/{args.id}/", method: "GET") {
      ...signupFields
    }
  }

  fragment contactPersonFields on ContactPerson {
    email
    firstName
    id
    lastName
    membershipNumber
    nativeLanguage
    notifications
    phoneNumber
    serviceLanguage
  }

  fragment paymentCancellationFields on PaymentCancellation {
    createdTime
    id
    payment
  }

  fragment paymentRefundFields on PaymentRefund {
    amount
    createdTime
    externalRefundId
    id
    payment
  }

  fragment signupPriceGroupFields on SignupPriceGroup {
    id
    priceGroup {
      ...densePriceGroupFields
    }
    price
    priceWithoutVat
    registrationPriceGroup
    vat
    vatPercentage
  }

  fragment signupFields on Signup {
    attendeeStatus
    city
    contactPerson {
      ...contactPersonFields
    }
    dateOfBirth
    extraInfo
    firstName
    id
    lastName
    paymentCancellation {
      ...paymentCancellationFields
    }
    paymentRefund {
      ...paymentRefundFields
    }
    phoneNumber
    priceGroup {
      ...signupPriceGroupFields
    }
    presenceStatus
    signupGroup
    streetAddress
    zipcode
  }
`;
