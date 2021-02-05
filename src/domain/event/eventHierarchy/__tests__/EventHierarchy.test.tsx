import map from 'lodash/map';
import React from 'react';

import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import EventHierarchy from '../EventHierarchy';

const subSubSubEventFields = [{ id: 'subevent:1', name: 'Sub event 1' }];
const subSubSubEvents = fakeEvents(
  subSubSubEventFields.length,
  subSubSubEventFields.map(({ id, name }) => ({ id, name: { fi: name } }))
);

const subSubEventPage2Fields = [
  { id: 'event:2', name: 'Event 2' },
  { id: 'event:3', name: 'Event 3' },
  { id: 'event:4', name: 'Event 4' },
];
const subSubPage2Events = fakeEvents(
  subSubEventPage2Fields.length,
  subSubEventPage2Fields.map(({ id, name }) => ({ id, name: { fi: name } }))
);

const subSubEventFields = [{ id: 'event:1', name: 'Event 1' }];
const subSubEvents = fakeEvents(
  subSubEventFields.length,
  subSubEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    subEvents: subSubSubEvents.data,
    superEventType: SuperEventType.Recurring,
  }))
);

const subEventFields = [{ id: 'recurring:1', name: 'Recurring event 1' }];

const subEvents = fakeEvents(
  subEventFields.length,
  subEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Umbrella,
  }))
);

const superEventId = 'superevent:1';
const superEventName = 'Super event 1';
const superEvent = fakeEvent({
  id: superEventId,
  name: { fi: superEventName },
  superEventType: SuperEventType.Umbrella,
});

const eventId = 'umbrella:1';
const eventName = 'Umbrella event 1';
const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  subEvents: subEvents.data,
  superEvent: superEvent,
  superEventType: SuperEventType.Umbrella,
});

const subSubSubEventsResponse = {
  data: {
    events: subSubSubEvents,
  },
};

const count = subSubEventFields.length + subSubEventPage2Fields.length;
const subSubEventsResponse = {
  data: {
    events: {
      ...subSubEvents,
      meta: {
        ...subSubEvents.meta,
        count,
        next: 'http://localhost:8000/v1/event/?page=2',
      },
    },
  },
};
const subSubEventsPage2Response = {
  data: {
    events: {
      ...subSubPage2Events,
      meta: {
        ...subSubEvents.meta,
        count,
        previous: 'http://localhost:8000/v1/event/',
      },
    },
  },
};

const subEventsResponse = {
  data: {
    events: subEvents,
  },
};

const baseVariables = {
  createPath: undefined,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
  pageSize: 100,
  showAll: true,
  sort: 'start_time',
};

const subSubSubEventsVariables = {
  ...baseVariables,
  superEvent: subSubEventFields[0].id,
};

const subSubEventsVariables = {
  ...baseVariables,
  superEvent: subEventFields[0].id,
};
const subSubEventsPage2Variables = { ...subSubEventsVariables, page: 2 };

const subEventsVariables = {
  ...baseVariables,
  superEvent: eventId,
};

const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: subSubSubEventsVariables,
    },
    result: subSubSubEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubEventsVariables,
    },
    result: subSubEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubEventsPage2Variables,
    },
    result: subSubEventsPage2Response,
  },
  {
    request: {
      query: EventsDocument,
      variables: subEventsVariables,
    },
    result: subEventsResponse,
  },
];

const renderComponent = (showSuperEvent = false) =>
  render(<EventHierarchy event={event} showSuperEvent={showSuperEvent} />, {
    mocks,
  });

const eventsShouldBeVisible = async (eventNames: string[]) => {
  for (const name of eventNames) {
    await screen.findByText(name);
  }
};

const eventsShouldBeHidden = (eventNames: string[]) => {
  for (const name of eventNames) {
    expect(screen.queryByText(name)).not.toBeInTheDocument();
  }
};

test('should render all events (except super event) in hierarchy by default', async () => {
  renderComponent();
  const allEvents = [
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ];
  await eventsShouldBeVisible(allEvents);

  // Super event is hidden by default
  await eventsShouldBeHidden([superEventName]);
});

test('should render also super event', async () => {
  renderComponent(true);
  const allEvents = [
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
    superEventName,
  ];
  await eventsShouldBeVisible(allEvents);
});

test('should hide/show sub-events when clicking toggle button', async () => {
  renderComponent();

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const hideUmbrellaButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${eventName}`,
  });
  userEvent.click(hideUmbrellaButton);

  await eventsShouldBeVisible([eventName]);

  eventsShouldBeHidden([
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const showUmbrellaButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${eventName}`,
  });
  userEvent.click(showUmbrellaButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const hideRecurringButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${subSubEventFields[0].name}`,
  });
  userEvent.click(hideRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
  ]);

  eventsShouldBeHidden([...map(subSubSubEventFields, 'name')]);

  const showRecurringButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${subSubEventFields[0].name}`,
  });
  userEvent.click(showRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);
});
