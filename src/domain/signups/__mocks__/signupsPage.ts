import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  AttendeeStatus,
  Meta,
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
import { TEST_SIGNUP_GROUP_ID } from '../../signupGroup/constants';
import { SIGNUPS_PAGE_SIZE } from '../constants';

const TEST_PAGE_SIZE = 2;

const registrationId = TEST_REGISTRATION_ID;
const signupGroupId = TEST_SIGNUP_GROUP_ID;

const attendeeNames = range(1, TEST_PAGE_SIZE + 1).map((n) => ({
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
const count = 30;
const meta: Meta = { ...attendees.meta, count };
attendees.meta = meta;

const page2PlaceNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 place ${n}`
);
const attendeeNamesPage2 = range(1, TEST_PAGE_SIZE + 1).map((n) => ({
  firstName: `Attendee`,
  lastName: `Page 2 user ${n}`,
}));
const attendeesPage2 = fakeSignups(
  attendeeNamesPage2.length,
  attendeeNamesPage2.map(({ firstName, lastName }, index) => ({
    attendeeStatus: AttendeeStatus.Attending,
    firstName,
    lastName,
  }))
);
attendeesPage2.meta = meta;

const attendeesWithGroup = fakeSignups(
  attendeeNames.length,
  attendeeNames.map(({ firstName, lastName }, index) => ({
    attendeeStatus: AttendeeStatus.Attending,
    id: `attending:${index}`,
    firstName,
    lastName,
    signupGroup: signupGroupId,
  }))
);

const getMockedAttendeesResponse = (
  signupsResponse: SignupsResponse,
  overrideVariables?: Partial<SignupsQueryVariables>
): MockedResponse => {
  const defaultVariables = {
    createPath: undefined,
    page: 1,
    pageSize: SIGNUPS_PAGE_SIZE,
    registration: [registrationId],
    text: '',
    attendeeStatus: AttendeeStatus.Attending,
  };

  return {
    request: {
      query: SignupsDocument,
      variables: { ...defaultVariables, ...overrideVariables },
    },
    result: { data: { signups: signupsResponse } },
  };
};

const mockedAttendeesResponse = getMockedAttendeesResponse(attendees, {
  attendeeStatus: AttendeeStatus.Attending,
});
const mockedAttendeesPage2Response = getMockedAttendeesResponse(
  attendeesPage2,
  {
    attendeeStatus: AttendeeStatus.Attending,
    page: 2,
  }
);

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
  { attendeeStatus: AttendeeStatus.Waitlisted }
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
  request: { query: SendMessageDocument, variables: sendMessageVariables },
  result: sendMessageResponse,
};

export {
  attendeeNames,
  attendeeNamesPage2,
  attendees,
  attendeesWithGroup,
  getMockedAttendeesResponse,
  mockedAttendeesPage2Response,
  mockedAttendeesResponse,
  mockedSendMessageResponse,
  mockedWaitingAttendeesResponse,
  sendMessageValues,
  signupGroupId,
  waitingAttendeeNames,
  waitingAttendees,
};
