import range from 'lodash/range';

import { Meta, RegistrationsDocument } from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeLocalisedObject,
  fakeRegistrations,
} from '../../../../utils/mockDataUtils';
import {
  REGISTRATION_LIST_INCLUDES,
  REGISTRATIONS_PAGE_SIZE,
} from '../../constants';

const PAGE_SIZE = 2;

const registrationNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const eventNames = range(1, PAGE_SIZE + 1).map((n) => `Event name ${n}`);

const registrations = fakeRegistrations(
  PAGE_SIZE,
  registrationNames.map((name, index) => ({
    id: `registration:${index}`,
    event: fakeEvent({
      id: `event:${index}`,
      name: fakeLocalisedObject(name),
    }),
  }))
);

const count = REGISTRATIONS_PAGE_SIZE * 2;
const meta: Meta = {
  ...registrations.meta,
  count,
};

const registrationsResponse = {
  data: { registrations: { ...registrations, meta } },
};

const registrationsVariables = {
  adminUser: true,
  createPath: undefined,
  eventType: [],
  include: REGISTRATION_LIST_INCLUDES,
  page: 1,
  pageSize: REGISTRATIONS_PAGE_SIZE,
  text: '',
};

const mockedRegistrationsResponse = {
  request: { query: RegistrationsDocument, variables: registrationsVariables },
  result: registrationsResponse,
};

const page2RegistrationNames = range(PAGE_SIZE + 1, 2 * PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);

const page2EventNames = range(PAGE_SIZE + 1, 2 * PAGE_SIZE + 1).map(
  (n) => `Event name ${n}`
);

const page2Registrations = fakeRegistrations(
  REGISTRATIONS_PAGE_SIZE,
  page2RegistrationNames.map((name, index) => ({
    event: fakeEvent({ name: fakeLocalisedObject(name) }),
    name,
  }))
);

const page2RegistrationsResponse = {
  data: { registrations: { ...page2Registrations, meta } },
};
const page2RegistrationsVariables = { ...registrationsVariables, page: 2 };

const mockedPage2RegistrationsResponse = {
  request: {
    query: RegistrationsDocument,
    variables: page2RegistrationsVariables,
  },
  result: page2RegistrationsResponse,
};

export {
  eventNames,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
  page2EventNames,
};
