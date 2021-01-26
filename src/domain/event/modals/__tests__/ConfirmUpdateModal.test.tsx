import React from 'react';

import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import ConfirmUpdateModal, {
  ConfirmUpdateModalProps,
} from '../ConfirmUpdateModal';

const subEventId = 'hel:123';
const subSubEventNames = ['Event 1', 'Event 2'];
const subSubEvents = fakeEvents(
  subSubEventNames.length,
  subSubEventNames.map((name) => ({
    name: { fi: name },
  }))
);
const eventName = 'Umbrella event name';
const subEventName = 'Recurring event name';
const subEventsData = fakeEvents(1, [
  {
    id: subEventId,
    name: { fi: subEventName },
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Recurring,
  },
]).data;

const event = fakeEvent({
  name: { fi: eventName },
  subEvents: subEventsData,
  superEventType: SuperEventType.Umbrella,
});
const subSubEventsResponse = { data: { events: subSubEvents } };

const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: {
        createPath: undefined,
        include: [
          'audience',
          'keywords',
          'location',
          'sub_events',
          'super_event',
        ],
        pageSize: 100,
        showAll: true,
        sort: 'start_time',
        superEvent: subEventId,
      },
    },
    result: subSubEventsResponse,
  },
];

const defaultProps: ConfirmUpdateModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onSave: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmUpdateModalProps>) =>
  render(<ConfirmUpdateModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman tallentaminen' });
  screen.getByText(translations.event.updateEventModal.text1);
  screen.getByText(translations.event.updateEventModal.text2);
  expect(screen.getByText(eventName));
  expect(screen.getByText(subEventName));
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }
  screen.getByRole('button', { name: 'Tallenna' });
  screen.getByRole('button', { name: 'Kumoa' });
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ onSave });

  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  const updateEventButton = screen.getByRole('button', {
    name: 'Tallenna',
  });
  userEvent.click(updateEventButton);
  expect(onSave).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  const closeButton = screen.getByRole('button', {
    name: 'Kumoa',
  });
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
