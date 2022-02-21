import range from 'lodash/range';

import { EventsDocument } from '../../../../../generated/graphql';
import { fakeEvents } from '../../../../../utils/mockDataUtils';

const umbrellaEventNames = range(1, 6).map((val) => `Event name ${val}`);
const umbrellaEvents = fakeEvents(
  umbrellaEventNames.length,
  umbrellaEventNames.map((name) => ({ name: { fi: name } }))
);

const umbrellaEventsVariables = {
  createPath: undefined,
  superEventType: ['umbrella'],
  text: '',
};
const umbrellaEventsResponse = { data: { events: umbrellaEvents } };
const mockedUmbrellaEventsResponse = {
  request: { query: EventsDocument, variables: umbrellaEventsVariables },
  result: umbrellaEventsResponse,
};

export { mockedUmbrellaEventsResponse };
