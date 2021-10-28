import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeRegistration, fakeUser } from '../../../utils/mockDataUtils';

const publisher = 'publisher:1';

const registrationId = 'registration:1';
const registration = fakeRegistration({ id: registrationId, publisher });

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

export { mockedUserResponse, registration, registrationId };
