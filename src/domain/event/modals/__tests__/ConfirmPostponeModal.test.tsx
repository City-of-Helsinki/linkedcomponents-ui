import React from 'react';

import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import ConfirmPostponeModal, {
  ConfirmPostponeModalProps,
} from '../ConfirmPostponeModal';

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

const defaultProps: ConfirmPostponeModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onPostpone: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmPostponeModalProps>) =>
  render(<ConfirmPostponeModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman lykkääminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.postponeEventModal.text1);
  screen.getByText(translations.event.postponeEventModal.text2);
  expect(screen.getByText(eventName));
  expect(screen.getByText(subEventName));
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }
  screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
  screen.getByRole('button', { name: 'Kumoa' });
});

test('should call onPostpone', async () => {
  const onPostpone = jest.fn();
  renderComponent({ onPostpone });

  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  const postponeEventButton = screen.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(postponeEventButton);
  expect(onPostpone).toBeCalled();
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
