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
} from '../../../../utils/testUtils';
import {
  event,
  eventName,
  filteredEvents,
  mockedEventResponse,
  mockedEventsResponse,
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

const mocks = [
  mockedEventsResponse,
  mockedEventResponse,
  mockedFilteredEventsResponse,
];

const defaultProps: EventSelectorProps = {
  getOption,
  texts: { assistive: helper, label },
  name,
  value: event.atId,
  variables: {
    sort: EVENT_SORT_OPTIONS.NAME,
    superEventType: ['umbrella'],
  },
  onChange: vi.fn(),
};

const renderComponent = (props?: Partial<EventSelectorProps>) =>
  render(<EventSelector {...defaultProps} {...props} />, { mocks });

const getToggleButton = () =>
  screen.getByRole('button', { name: new RegExp(label) });

const getInput = (): HTMLInputElement =>
  screen.getByRole('combobox', { name: new RegExp(label) });

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  const user = userEvent.setup();

  renderComponent();

  const toggleButton = getToggleButton();

  await user.click(toggleButton);

  expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

  for (const option of filteredEvents.data) {
    await screen.findByRole('option', { name: getValue(option?.name?.fi, '') });
  }
});

test('should search for places', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getToggleButton();

  await user.click(toggleButton);

  const input = getInput();

  await user.type(input, eventName);

  for (const option of filteredEvents.data) {
    await screen.findByRole('option', {
      hidden: true,
      name: new RegExp(getValue(option?.name?.fi, '')),
    });
  }
});
