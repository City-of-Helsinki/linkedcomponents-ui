import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import { AttendeeStatus, EnrolmentsDocument } from '../../../generated/graphql';
import { fakeEnrolments } from '../../../utils/mockDataUtils';
import { ENROLMENTS_PAGE_SIZE } from '../constants';

const registrationId = 'registration:1';
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

const attendeesResponse = { data: { enrolments: attendees } };

const attendeesVariables = {
  createPath: undefined,
  registrations: [registrationId],
  text: '',
  attendeeStatus: AttendeeStatus.Attending,
};

const mockedAttendeesResponse: MockedResponse = {
  request: { query: EnrolmentsDocument, variables: attendeesVariables },
  result: attendeesResponse,
};

const waitingAttendeeNames = range(1, 2).map(
  (n) => `Waiting attendee name ${n}`
);

const waitingAttendees = fakeEnrolments(
  waitingAttendeeNames.length,
  attendeeNames.map((name, index) => ({
    attendeeStatus: AttendeeStatus.Waitlisted,
    id: `waitlisted:${index}`,
    name,
  }))
);

const waitingAttendeesResponse = { data: { enrolments: waitingAttendees } };

const waitingAttendeesVariables = {
  createPath: undefined,
  registrations: [registrationId],
  text: '',
  attendeeStatus: AttendeeStatus.Waitlisted,
};

const mockedWaitingAttendeesResponse: MockedResponse = {
  request: { query: EnrolmentsDocument, variables: waitingAttendeesVariables },
  result: waitingAttendeesResponse,
};

export {
  attendeeNames,
  attendees,
  attendeesResponse,
  mockedAttendeesResponse,
  mockedWaitingAttendeesResponse,
  waitingAttendeeNames,
  waitingAttendees,
  waitingAttendeesResponse,
};
