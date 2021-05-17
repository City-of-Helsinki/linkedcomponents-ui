import range from 'lodash/range';
import React from 'react';

import { EventDocument, EventsDocument } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  TEST_NOCACHE_TIME,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import UmbrellaEventSelector, {
  UmbrellaEventSelectorProps,
} from '../UmbrellaEventSelector';

const eventId = 'hel:123';
const eventAtId = `https://api.hel.fi/linkedevents/v1/event/${eventId}/`;
const eventName = 'Event name';
const helper = 'Helper text';
const label = 'Select umbrella event';
const name = 'umbrellaEvent';

const event = fakeEvent({
  id: eventId,
  atId: eventAtId,
  name: { fi: eventName },
});

const eventResponse = { data: { event: event } };

const eventNames = range(1, 6).map((val) => `Event name ${val}`);
const events = fakeEvents(
  eventNames.length,
  eventNames.map((name) => ({ name: { fi: name } }))
);
const eventsResponse = { data: { events } };

const defaultEventsVariables = {
  createPath: undefined,
  nocache: TEST_NOCACHE_TIME,
  superEventType: ['umbrella'],
  text: '',
};

const filteredEventsVariables = {
  ...defaultEventsVariables,
  text: eventName,
};

const filteredEvents = fakeEvents(1, [event]);
const filteredEventsResponse = { data: { events: filteredEvents } };

const mocks = [
  {
    request: {
      query: EventDocument,
      variables: {
        id: eventId,
        createPath: undefined,
        nocache: TEST_NOCACHE_TIME,
      },
    },
    result: eventResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: defaultEventsVariables,
    },
    result: eventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: filteredEventsVariables,
    },
    result: filteredEventsResponse,
  },
];

const defaultProps: UmbrellaEventSelectorProps = {
  helper,
  label,
  name,
  value: eventAtId,
};

const renderComponent = (props?: Partial<UmbrellaEventSelectorProps>) =>
  render(<UmbrellaEventSelector {...defaultProps} {...props} />, { mocks });

test('should combobox input value to be selected event', async () => {
  renderComponent();

  const inputField = screen.queryByRole('combobox', {
    name: new RegExp(helper),
  });

  await waitFor(() => expect(inputField).toHaveValue(eventName));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  const inputField = screen.queryByRole('combobox', {
    name: new RegExp(helper),
  });

  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = screen.queryByRole('button');
  userEvent.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');

  for (const option of filteredEvents.data) {
    await screen.findByRole('option', { hidden: true, name: option.name.fi });
  }
});
