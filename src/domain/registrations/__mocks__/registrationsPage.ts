import range from 'lodash/range';

import { RegistrationsDocument } from '../../../generated/graphql';
import {
  fakeEvents,
  fakeLocalisedObject,
  fakeRegistrations,
} from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_LIST_INCLUDES,
  REGISTRATIONS_PAGE_SIZE,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const publisher = TEST_PUBLISHER_ID;
const registrationNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const eventNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const events = fakeEvents(
  TEST_PAGE_SIZE,
  eventNames.map((name, index) => ({
    id: `event:${index}`,
    name: fakeLocalisedObject(name),
    publisher,
  }))
);

const registrations = fakeRegistrations(
  TEST_PAGE_SIZE,
  registrationNames.map((name, index) => ({
    id: `registration:${index}`,
    event: events.data[index],
    name,
    publisher,
  }))
);

const registrationsResponse = { data: { registrations } };
const registrationsVariables = {
  adminUser: true,
  createPath: undefined,
  eventType: [],
  include: REGISTRATION_LIST_INCLUDES,
  page: 1,
  pageSize: REGISTRATIONS_PAGE_SIZE,
  publisher: [],
  sort: DEFAULT_REGISTRATION_SORT,
  text: '',
};

const mockedRegistrationsResponse = {
  request: { query: RegistrationsDocument, variables: registrationsVariables },
  result: registrationsResponse,
};

export {
  eventNames,
  mockedRegistrationsResponse,
  registrationNames,
  registrations,
  registrationsResponse,
};
