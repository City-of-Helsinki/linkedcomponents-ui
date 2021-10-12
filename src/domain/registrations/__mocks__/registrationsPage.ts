import range from 'lodash/range';

import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeRegistrations, fakeUser } from '../../../utils/mockDataUtils';
import { REGISTRATIONS_PAGE_SIZE, TEST_EVENT_ID } from '../constants';

const publisher = 'publisher:1';
const registrationNames = range(1, REGISTRATIONS_PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);

const registrations = fakeRegistrations(
  REGISTRATIONS_PAGE_SIZE,
  registrationNames.map((name, index) => ({
    id: `registration:${index}`,
    eventId: TEST_EVENT_ID,
    name: { fi: name },
  }))
);

const registrationsResponse = { registrations };

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
  mockedUserResponse,
  registrationNames,
  registrations,
  registrationsResponse,
};
