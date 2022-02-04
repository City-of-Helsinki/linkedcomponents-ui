import range from 'lodash/range';

import { AttendeeStatus } from '../../../generated/graphql';
import { fakeEnrolments } from '../../../utils/mockDataUtils';
import { ENROLMENTS_PAGE_SIZE } from '../constants';

const attendeeNames = range(1, ENROLMENTS_PAGE_SIZE + 1).map(
  (n) => `Attendee name ${n}`
);

const attendees = fakeEnrolments(
  ENROLMENTS_PAGE_SIZE,
  attendeeNames.map((name, index) => ({
    attendeeStatus: AttendeeStatus.Attending,
    id: `attending:${index}`,
    name,
  }))
);

const attendeesResponse = { enrolments: attendees };

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

const waitingAttendeesResponse = { enrolments: waitingAttendees };

export {
  attendeeNames,
  attendees,
  attendeesResponse,
  waitingAttendeeNames,
  waitingAttendees,
  waitingAttendeesResponse,
};
