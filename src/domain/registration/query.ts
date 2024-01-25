// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_REGISTRATION = gql`
  fragment registrationUserAccessFields on RegistrationUserAccess {
    email
    id
    isSubstituteUser
    language
  }

  fragment registrationFields on Registration {
    id
    atId
    audienceMaxAge
    audienceMinAge
    confirmationMessage {
      ...localisedFields
    }
    createdBy
    currentAttendeeCount
    currentWaitingListCount
    dataSource
    enrolmentEndTime
    enrolmentStartTime
    event {
      ...eventFields
    }
    hasRegistrationUserAccess
    hasSubstituteUserAccess
    instructions {
      ...localisedFields
    }
    isCreatedByCurrentUser
    lastModifiedTime
    mandatoryFields
    maximumAttendeeCapacity
    maximumGroupSize
    minimumAttendeeCapacity
    remainingAttendeeCapacity
    remainingWaitingListCapacity
    publisher
    registrationUserAccesses {
      ...registrationUserAccessFields
    }
    signups {
      ...signupFields
    }
    waitingListCapacity
  }

  query Registration($id: ID!, $include: [String], $createPath: Any) {
    registration(id: $id, include: $include)
      @rest(type: "Registration", pathBuilder: $createPath) {
      ...registrationFields
    }
  }
`;
