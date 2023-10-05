import React from 'react';

import { getEventFields } from '../../../../domain/event/utils';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { EventFieldsFragment } from '../../../../generated/graphql';
import { Language, OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  event,
  eventName,
  filteredEvents,
  mockedEventResponse,
  mockedFilteredEventsResponse,
} from '../__mocks__/eventSelector';
import EventSelector, { EventSelectorProps } from '../EventSelector';

configure({ defaultHidden: true });

const helper = 'Helper text';
const label = 'Select umbrella event';
const name = 'umbrellaEvent';

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
  toggleButtonAriaLabel: '',
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

test('combobox input value to should be selected event name', async () => {
  renderComponent();

  const inputField = getElement('inputField');
  await waitFor(() => expect(inputField).toHaveValue(eventName));
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  const user = userEvent.setup();
  renderComponent();

  const inputField = getElement('inputField');
  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = getElement('toggleButton');

  await user.click(toggleButton);
  expect(inputField.getAttribute('aria-expanded')).toBe('true');

  for (const option of filteredEvents.data) {
    await screen.findByRole('option', { name: getValue(option?.name?.fi, '') });
  }
});
