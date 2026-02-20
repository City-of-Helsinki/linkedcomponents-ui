import React from 'react';

import { EventDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { EVENT_WITH_SUB_EVENTS_INCLUDES } from '../../../event/constants';
import EventTimes, { EventTimesProps } from '../EventTimes';

const eventWithSubEvents = fakeEvent({
  superEventType: SuperEventType.Recurring,
  subEvents: [
    fakeEvent({
      startTime: '2024-01-01T12:00:00.000000Z',
      endTime: '2024-01-01T13:00:00.000000Z',
    }),
    fakeEvent({
      startTime: '2024-01-02T13:00:00.000000Z',
      endTime: '2024-01-02T14:00:00.000000Z',
    }),
    fakeEvent({
      startTime: '2024-01-03T14:00:00.000000Z',
      endTime: '2024-01-03T15:00:00.000000Z',
    }),
  ],
});

const eventVariables = {
  createPath: undefined,
  id: eventWithSubEvents.id,
  include: EVENT_WITH_SUB_EVENTS_INCLUDES,
};
const eventResponse = { data: { event: eventWithSubEvents } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const mocks = [mockedEventResponse];

const defaultProps: EventTimesProps = { event: eventWithSubEvents };

const renderComponent = (props?: Partial<EventTimesProps>) =>
  render(<EventTimes {...defaultProps} {...props} />, { mocks });

test('should show event times if event is recurring event', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = await screen.findByRole('button', {
    name: 'Kaikki tapahtuma-ajat',
  });
  await user.click(toggleButton);
  await loadingSpinnerIsNotInDocument();
  await screen.findByText('1.1.2024, 12.00 – 13.00');
  screen.getByText('2.1.2024, 13.00 – 14.00');
  screen.getByText('3.1.2024, 14.00 – 15.00');
});

test('should not show event times if super event type is null', async () => {
  renderComponent({ event: fakeEvent({ superEventType: null }) });

  expect(
    screen.queryByRole('button', { name: 'Kaikki tapahtuma-ajat' })
  ).not.toBeInTheDocument();
});
