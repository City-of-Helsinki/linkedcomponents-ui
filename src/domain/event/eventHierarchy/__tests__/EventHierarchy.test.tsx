import flatMap from 'lodash/flatMap';
import React from 'react';

import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import EventHierarchy from '../EventHierarchy';

const eventId = 'umbrella:1';
const eventName = 'Umbrella event 1';
const subEventFields = [{ id: 'recurring:1', name: 'Recurring event 1' }];
const subSubEventFields = [{ id: 'event:1', name: 'Event 1' }];
const subSubEventPage2Fields = [
  { id: 'event:2', name: 'Event 2' },
  { id: 'event:3', name: 'Event 3' },
  { id: 'event:4', name: 'Event 4' },
];
const subSubSubEventFields = [{ id: 'subevent:1', name: 'Sub event 1' }];
const subSubSubEvents = fakeEvents(
  subSubSubEventFields.length,
  subSubSubEventFields.map(({ id, name }) => ({ id, name: { fi: name } }))
);
const subSubEvents = fakeEvents(
  subSubEventFields.length,
  subSubEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    subEvents: subSubSubEvents.data,
    superEventType: SuperEventType.Recurring,
  }))
);

const subSubPage2Events = fakeEvents(
  subSubEventPage2Fields.length,
  subSubEventPage2Fields.map(({ id, name }) => ({ id, name: { fi: name } }))
);

const subEvents = fakeEvents(
  subEventFields.length,
  subEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Umbrella,
  }))
);

const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  subEvents: subEvents.data,
  superEventType: SuperEventType.Umbrella,
});

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

const subSubSubEventsResponse = {
  data: {
    events: subSubSubEvents,
  },
};
const baseVariables = {
  createPath: undefined,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
  pageSize: 100,
  showAll: true,
  sort: 'start_time',
};
const subSubEventsVariables = {
  ...baseVariables,
  superEvent: subEventFields[0].id,
};
const subSubSubEventsVariables = {
  ...baseVariables,
  superEvent: subSubEventFields[0].id,
};

const mocks = [
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
      variables: { ...subSubEventsVariables, page: 2 },
    },
    result: subSubEventsPage2Response,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubSubEventsVariables,
    },
    result: subSubSubEventsResponse,
  },
];

const renderComponent = () =>
  render(<EventHierarchy event={event} />, { mocks });

const eventsShouldBeVisible = async (eventNames: string[]) => {
  for (const name of eventNames) {
    await screen.findByText(name);
  }
};

const eventsShouldBeHidden = async (eventNames: string[]) => {
  for (const name of eventNames) {
    await expect(screen.queryByText(name)).not.toBeInTheDocument();
  }
};

test('should render all events in heirarchy by default', async () => {
  renderComponent();
  const allEvents = [
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
  ];
  await eventsShouldBeVisible(allEvents);
});

test('should hide/show sub-events when clicking toggle button', async () => {
  renderComponent();

  await eventsShouldBeVisible([
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
  ]);

  const hideUmbrellaButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${eventName}`,
  });
  userEvent.click(hideUmbrellaButton);

  await eventsShouldBeVisible([eventName]);

  await eventsShouldBeHidden([
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
  ]);

  const showUmbrellaButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${eventName}`,
  });
  userEvent.click(showUmbrellaButton);

  await eventsShouldBeVisible([
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
  ]);

  const hideRecurringButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${subSubEventFields[0].name}`,
  });
  userEvent.click(hideRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
  ]);

  await eventsShouldBeHidden([...flatMap(subSubSubEventFields, 'name')]);

  const showRecurringButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${subSubEventFields[0].name}`,
  });
  userEvent.click(showRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...flatMap(subEventFields, 'name'),
    ...flatMap(subSubEventFields, 'name'),
    ...flatMap(subSubEventPage2Fields, 'name'),
    ...flatMap(subSubSubEventFields, 'name'),
  ]);
});
