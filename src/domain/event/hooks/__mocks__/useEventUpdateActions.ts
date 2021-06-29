import { MockedResponse } from '@apollo/client/testing';

import {
  DeleteEventDocument,
  EventDocument,
  EventStatus,
  SuperEventType,
  UpdateEventDocument,
  UpdateEventsDocument,
} from '../../../../generated/graphql';
import { basePayload, event, subEvents } from '../../__mocks__/editEventPage';
import { EVENT_INCLUDES } from '../../constants';

const eventWithRecurringSuperEvent1 = {
  ...subEvents.data[0],
  superEvent: event,
};

const eventWithRecurringSuperEvent2 = {
  ...subEvents.data[1],
  superEvent: { ...event, superEventType: SuperEventType.Recurring },
};

const postponeEventWithRecurringSuperEventVariables = {
  input: [
    {
      ...basePayload,
      id: subEvents.data[0].id,
      superEvent: { atId: event.atId },
      startTime: null,
      endTime: null,
    },
  ],
};
const postponeEventWithRecurringSuperEventResponse = {
  data: {
    event: {
      ...eventWithRecurringSuperEvent1,
      startTime: '',
      endTime: '',
      eventStatus: EventStatus.EventPostponed,
    },
  },
};
const mockedPostponeEventWithRecurringSuperEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: postponeEventWithRecurringSuperEventVariables,
  },
  result: postponeEventWithRecurringSuperEventResponse,
};

const deleteEventWithRecurringSuperEventVariables = {
  id: subEvents.data[0].id,
};
const deleteEventWithRecurringSuperEventResponse = { data: null };
const mockedDeleteEventWithRecurringSuperEventResponse: MockedResponse = {
  request: {
    query: DeleteEventDocument,
    variables: deleteEventWithRecurringSuperEventVariables,
  },
  result: deleteEventWithRecurringSuperEventResponse,
};

const recurringEventWithDeletedSubEvent = {
  ...event,
  subEvents: [subEvents.data[1]],
  superEventType: SuperEventType.Recurring,
};

const recurringEventWithDeletedSubEventVariables = {
  createPath: undefined,
  id: event.id,
  include: EVENT_INCLUDES,
};
const recurringEventWithDeletedSubEventResponse = {
  data: { event: recurringEventWithDeletedSubEvent },
};
const mockedRecurringEventWithDeletedSubEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: recurringEventWithDeletedSubEventVariables,
  },
  result: recurringEventWithDeletedSubEventResponse,
};

const updateRecurringEventWithDeletedSubEventVariables = {
  input: {
    ...basePayload,
    endTime: subEvents.data[1].endTime,
    startTime: subEvents.data[1].startTime,
    superEventType: SuperEventType.Recurring,
    subEvents: [{ atId: subEvents.data[1].atId }],
  },
};
const mockedUpdateRecurringEventWithDeletedSubEventResponse: MockedResponse = {
  request: {
    query: UpdateEventDocument,
    variables: updateRecurringEventWithDeletedSubEventVariables,
  },
  result: recurringEventWithDeletedSubEventResponse,
};

const updateEventWithRecurringSuperEventVariables = {
  input: [
    {
      ...basePayload,
      id: subEvents.data[1].id,
      superEvent: { atId: event.atId },
      startTime: subEvents.data[1].startTime,
      endTime: subEvents.data[1].endTime,
    },
  ],
};
const updateEventWithRecurringSuperEventResponse = {
  data: {
    event: {
      ...eventWithRecurringSuperEvent1,
      startTime: subEvents.data[1].startTime,
      endTime: subEvents.data[1].endTime,
      eventStatus: EventStatus.EventPostponed,
    },
  },
};
const mockedUpdateEventWithRecurringSuperEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateEventWithRecurringSuperEventVariables,
  },
  result: updateEventWithRecurringSuperEventResponse,
};

const recurringSuperEvent = {
  ...event,
  subEvents: subEvents.data,
  superEventType: SuperEventType.Recurring,
};
const deleteSubEvent1Variables = { id: subEvents.data[0].id };
const deleteSubEvent1Response = { data: null };
const mockedDeleteSubEvent1Response: MockedResponse = {
  request: { query: DeleteEventDocument, variables: deleteSubEvent1Variables },
  result: deleteSubEvent1Response,
};

export {
  eventWithRecurringSuperEvent1,
  eventWithRecurringSuperEvent2,
  mockedDeleteEventWithRecurringSuperEventResponse,
  mockedDeleteSubEvent1Response,
  mockedPostponeEventWithRecurringSuperEventResponse,
  mockedRecurringEventWithDeletedSubEventResponse,
  mockedUpdateEventWithRecurringSuperEventResponse,
  mockedUpdateRecurringEventWithDeletedSubEventResponse,
  recurringSuperEvent,
};
