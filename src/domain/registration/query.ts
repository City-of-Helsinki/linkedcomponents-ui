// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const QUERY_EVENT = gql`
  fragment registrationFields on Registration {
    id
    atId
    audienceMaxAge
    audienceMinAge
    confirmationMessage
    enrolmentEndTime
    enrolmentStartTime
    event
    instructions
    maximumAttendeeCapacity
    minimumAttendeeCapacity
    waitingListCapacity
  }
`;
