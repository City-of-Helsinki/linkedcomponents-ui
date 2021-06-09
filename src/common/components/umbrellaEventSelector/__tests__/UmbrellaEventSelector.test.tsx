import React from 'react';

import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
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
const eventName = 'Event name';
const helper = 'Helper text';
const label = 'Select umbrella event';
const name = 'umbrellaEvent';

const event = fakeEvent({ id: eventId, name: { fi: eventName } });
const eventVariables = { createPath: undefined, id: eventId };
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
  sort: EVENT_SORT_OPTIONS.NAME,
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
  value: event.atId,
};

const renderComponent = (props?: Partial<UmbrellaEventSelectorProps>) =>
  render(<UmbrellaEventSelector {...defaultProps} {...props} />, { mocks });

const getElement = (key: 'inputField' | 'toggleButton') => {
  switch (key) {
    case 'inputField':
      return screen.getByRole('combobox', { name: new RegExp(helper) });
    case 'toggleButton':
      return screen.getByRole('button', { name: new RegExp(label) });
  }
};

test('should combobox input value to be selected event', async () => {
  renderComponent();

  const inputField = getElement('inputField');
  await waitFor(() => expect(inputField).toHaveValue(eventName));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  const inputField = getElement('inputField');
  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');
  for (const option of filteredEvents.data) {
    await screen.findByRole('option', { hidden: true, name: option.name.fi });
  }
});
