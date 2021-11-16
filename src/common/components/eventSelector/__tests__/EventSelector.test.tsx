import React from 'react';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import {
  EventDocument,
  EventFieldsFragment,
  EventsDocument,
} from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import EventSelector, { EventSelectorProps } from '../EventSelector';

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

const getOption = (
  event: EventFieldsFragment,
  locale: Language
): OptionType => {
  const { atId, name } = getEventFields(event, locale);
  return { label: name, value: atId };
};

const mocks = [mockedEventResponse, mockedFilteredEventsResponse];

const defaultProps: EventSelectorProps = {
  getOption,
  helper,
  label,
  name,
  value: event.atId,
  variables: {
    sort: EVENT_SORT_OPTIONS.NAME,
    superEventType: ['umbrella'],
  },
};

const renderComponent = (props?: Partial<EventSelectorProps>) =>
  render(<EventSelector {...defaultProps} {...props} />, { mocks });

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
