import range from 'lodash/range';

import {
  EventDocument,
  Meta,
  RegistrationsDocument,
} from '../../../../generated/graphql';
import {
  fakeEvents,
  fakeLocalisedObject,
  fakeRegistrations,
} from '../../../../utils/mockDataUtils';
import { EVENT_INCLUDES } from '../../../event/constants';
import { REGISTRATIONS_PAGE_SIZE } from '../../constants';

const PAGE_SIZE = 2;

const registrationNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const eventNames = range(1, PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  PAGE_SIZE,
  eventNames.map((name, index) => ({
    id: `event:${index}`,
    name: fakeLocalisedObject(name),
  }))
);

const mockedEventResponses = [
  ...events.data.map((event) => ({
    request: {
      query: EventDocument,
      variables: {
        createPath: undefined,
        id: event?.id,
        include: EVENT_INCLUDES,
      },
    },
    result: { data: { event } },
  })),
];

const registrations = fakeRegistrations(
  PAGE_SIZE,
  registrationNames.map((name, index) => ({
    id: `registration:${index}`,
    event: events.data[index]?.id,
    name,
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

const page2Events = fakeEvents(
  PAGE_SIZE,
  page2EventNames.map((name, index) => ({ name: fakeLocalisedObject(name) }))
);

const mockedPage2EventResponses = [
  ...page2Events.data.map((event) => ({
    request: {
      query: EventDocument,
      variables: {
        createPath: undefined,
        id: event?.id,
        include: EVENT_INCLUDES,
      },
    },
    result: { data: { event } },
  })),
];

const page2Registrations = fakeRegistrations(
  REGISTRATIONS_PAGE_SIZE,
  page2RegistrationNames.map((name, index) => ({
    event: page2Events.data[index]?.id,
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
  mockedEventResponses,
  mockedPage2EventResponses,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
  page2EventNames,
};
