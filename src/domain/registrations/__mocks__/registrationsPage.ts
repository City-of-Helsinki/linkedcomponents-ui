import range from 'lodash/range';

import {
  EventDocument,
  RegistrationsDocument,
} from '../../../generated/graphql';
import {
  fakeEvents,
  fakeLocalisedObject,
  fakeRegistrations,
} from '../../../utils/mockDataUtils';
import { EVENT_INCLUDES } from '../../event/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { REGISTRATIONS_PAGE_SIZE } from '../constants';

const publisher = TEST_PUBLISHER_ID;
const registrationNames = range(1, REGISTRATIONS_PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const eventNames = range(1, REGISTRATIONS_PAGE_SIZE + 1).map(
  (n) => `Registration name ${n}`
);
const events = fakeEvents(
  REGISTRATIONS_PAGE_SIZE,
  eventNames.map((name, index) => ({
    id: `event:${index}`,
    name: fakeLocalisedObject(name),
    publisher,
  }))
);
const mockedEventResponses = [
  ...events.data.map((event) => ({
    request: {
      query: EventDocument,
      variables: {
        createPath: undefined,
        id: event.id,
        include: EVENT_INCLUDES,
      },
    },
    result: { data: { event } },
  })),
];

const registrations = fakeRegistrations(
  REGISTRATIONS_PAGE_SIZE,
  registrationNames.map((name, index) => ({
    id: `registration:${index}`,
    event: events.data[index].id,
    name,
    publisher,
  }))
);

const registrationsResponse = { data: { registrations } };
const registrationsVariables = {
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

export {
  eventNames,
  mockedEventResponses,
  mockedRegistrationsResponse,
  registrationNames,
  registrations,
  registrationsResponse,
};
