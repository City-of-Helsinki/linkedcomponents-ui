import range from 'lodash/range';

import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeEnrolments, fakeUser } from '../../../utils/mockDataUtils';
import { registrations } from '../../registrations/__mocks__/registrationsPage';
import { ENROLMENTS_PAGE_SIZE } from '../constants';

const publisher = 'publisher:1';

const registration = registrations.data[0];

const attendeeNames = range(1, ENROLMENTS_PAGE_SIZE + 1).map(
  (n) => `Attendee name ${n}`
);

const attendees = fakeEnrolments(
  ENROLMENTS_PAGE_SIZE,
  attendeeNames.map((name, index) => ({
    id: `attendee:${index}`,
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
    id: `attendee:${index}`,
    name,
  }))
);

const waitingAttendeesResponse = { enrolments: waitingAttendees };

// User mocks
const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
});
const userVariables = { createPath: undefined, id: TEST_USER_ID };
const userResponse = { data: { user } };
const mockedUserResponse = {
  request: { query: UserDocument, variables: userVariables },
  result: userResponse,
};

export {
  attendeeNames,
  attendees,
  attendeesResponse,
  mockedUserResponse,
  registration,
  waitingAttendeeNames,
  waitingAttendees,
  waitingAttendeesResponse,
};
