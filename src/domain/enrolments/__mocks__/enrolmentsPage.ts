import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  AttendeeStatus,
  SendMessageDocument,
  SignupsDocument,
  SignupsQueryVariables,
  SignupsResponse,
} from '../../../generated/graphql';
import {
  fakeSendMessageResponse,
  fakeSignups,
} from '../../../utils/mockDataUtils';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { ENROLMENTS_PAGE_SIZE } from '../constants';

const registrationId = TEST_REGISTRATION_ID;
const attendeeNames = range(1, 2 * ENROLMENTS_PAGE_SIZE + 1).map((n) => ({
  firstName: `Attendee`,
  lastName: `User ${n}`,
}));

const attendees = fakeSignups(
  attendeeNames.length,
  attendeeNames.map(({ firstName, lastName }, index) => ({
    attendeeStatus: AttendeeStatus.Attending,
    id: `attending:${index}`,
    firstName,
    lastName,
  }))
);

const getMockedAttendeesResponse = (
  enrolmentsResponse: SignupsResponse,
  overrideVariables?: Partial<SignupsQueryVariables>
): MockedResponse => {
  const defaultVariables = {
    createPath: undefined,
    registration: [registrationId],
    text: '',
    attendeeStatus: AttendeeStatus.Attending,
  };
  const attendeesResponse = { data: { signups: enrolmentsResponse } };
  return {
    request: {
      query: SignupsDocument,
      variables: { ...defaultVariables, ...overrideVariables },
    },
    result: attendeesResponse,
  };
};

const mockedAttendeesResponse = getMockedAttendeesResponse(attendees, {
  attendeeStatus: AttendeeStatus.Attending,
});

const waitingAttendeeNames = range(1, 2).map((n) => ({
  firstName: `Waiting attendee`,
  lastName: `User ${n}`,
}));

const waitingAttendees = fakeSignups(
  waitingAttendeeNames.length,
  waitingAttendeeNames.map(({ firstName, lastName }, index) => ({
    attendeeStatus: AttendeeStatus.Waitlisted,
    id: `waitlisted:${index}`,
    firstName,
    lastName,
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
