import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  AttendeeStatus,
  EnrolmentsDocument,
  EnrolmentsQueryVariables,
  EnrolmentsResponse,
  SendMessageDocument,
} from '../../../generated/graphql';
import {
  fakeEnrolments,
  fakeSendMessageResponse,
} from '../../../utils/mockDataUtils';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { ENROLMENTS_PAGE_SIZE } from '../constants';

const registrationId = TEST_REGISTRATION_ID;
const attendeeNames = range(1, 2 * ENROLMENTS_PAGE_SIZE + 1).map(
  (n) => `Attendee name ${n}`
);

const attendees = fakeEnrolments(
  attendeeNames.length,
  attendeeNames.map((name, index) => ({
    attendeeStatus: AttendeeStatus.Attending,
    id: `attending:${index}`,
    name,
  }))
);

const getMockedAttendeesResponse = (
  enrolmentsResponse: EnrolmentsResponse,
  overrideVariables?: Partial<EnrolmentsQueryVariables>
): MockedResponse => {
  const defaultVariables = {
    createPath: undefined,
    registration: [registrationId],
    text: '',
    attendeeStatus: AttendeeStatus.Attending,
  };
  const attendeesResponse = { data: { enrolments: enrolmentsResponse } };
  return {
    request: {
      query: EnrolmentsDocument,
      variables: { ...defaultVariables, ...overrideVariables },
    },
    result: attendeesResponse,
  };
};

const mockedAttendeesResponse = getMockedAttendeesResponse(attendees, {
  attendeeStatus: AttendeeStatus.Attending,
});

const waitingAttendeeNames = range(1, 2).map(
  (n) => `Waiting attendee name ${n}`
);

const waitingAttendees = fakeEnrolments(
  waitingAttendeeNames.length,
  waitingAttendeeNames.map((name, index) => ({
    attendeeStatus: AttendeeStatus.Waitlisted,
    id: `waitlisted:${index}`,
    name,
  }))
);

const mockedWaitingAttendeesResponse = getMockedAttendeesResponse(
  waitingAttendees,
  {
    attendeeStatus: AttendeeStatus.Waitlisted,
  }
);

const sendMessageValues = {
  body: '<p>Message</p>',
  subject: 'Subject',
};

const sendMessageVariables = {
  input: {
    ...sendMessageValues,
    body: '<p>Message</p>',
    subject: 'Subject',
  },
  registration: registrationId,
};

const sendMessageResponse = {
  data: { sendMessage: fakeSendMessageResponse() },
};

const mockedSendMessageResponse: MockedResponse = {
  request: {
    query: SendMessageDocument,
    variables: sendMessageVariables,
  },
  result: sendMessageResponse,
};

export {
  attendeeNames,
  attendees,
  getMockedAttendeesResponse,
  mockedAttendeesResponse,
  mockedSendMessageResponse,
  mockedWaitingAttendeesResponse,
  sendMessageValues,
  waitingAttendeeNames,
  waitingAttendees,
};
