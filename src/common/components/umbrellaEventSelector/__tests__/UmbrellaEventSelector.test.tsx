import React from 'react';

import { EventDocument, EventsDocument } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import UmbrellaEventSelector, {
  UmbrellaEventSelectorProps,
} from '../UmbrellaEventSelector';

configure({ defaultHidden: true });

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
const eventVariables = {
  id: eventId,
  createPath: undefined,
};
const eventResponse = { data: { event: event } };
const mockedEventResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: eventResponse,
};

const filteredEventsVariables = {
  createPath: undefined,
  superEventType: ['umbrella'],
  text: '',
};
const filteredEvents = fakeEvents(1, [event]);
const filteredEventsResponse = { data: { events: filteredEvents } };
const mockedFilteredEventsResponse = {
  request: {
    query: EventsDocument,
    variables: filteredEventsVariables,
  },
  result: filteredEventsResponse,
};

const mocks = [mockedEventResponse, mockedFilteredEventsResponse];

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

  const toggleButton = screen.getByRole('button');
  userEvent.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');

  for (const option of filteredEvents.data) {
    await screen.findByRole('option', { hidden: true, name: option.name.fi });
  }
});
