import map from 'lodash/map';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  event,
  eventName,
  mockedSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubSubEventsResponse,
  mockedSubSubSubEventsResponse,
  subEventFields,
  subSubEventFields,
  subSubEventPage2Fields,
  subSubSubEventFields,
  superEventName,
} from '../__mocks__/eventHierarchy';
import EventHierarchy from '../EventHierarchy';

configure({ defaultHidden: true });

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedSubSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubEventsResponse,
  mockedSubSubSubEventsResponse,
];

const renderComponent = (showSuperEvent = false) =>
  render(<EventHierarchy event={event} showSuperEvent={showSuperEvent} />, {
    mocks,
  });

const eventsShouldBeVisible = async (eventNames: string[]) => {
  for (const name of eventNames) {
    await screen.findByText(name);
  }
};

const eventsShouldBeHidden = (eventNames: string[]) => {
  for (const name of eventNames) {
    expect(screen.queryByText(name)).not.toBeInTheDocument();
  }
};

test('should render all events (except super event) in hierarchy by default', async () => {
  renderComponent();
  const allEvents = [
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ];
  await eventsShouldBeVisible(allEvents);

  // Super event is hidden by default
  eventsShouldBeHidden([superEventName]);
});

test('should render also super event', async () => {
  renderComponent(true);
  const allEvents = [
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
    superEventName,
  ];
  await eventsShouldBeVisible(allEvents);
});

test('should hide/show sub-events when clicking toggle button', async () => {
  const user = userEvent.setup();
  renderComponent();

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const hideUmbrellaButton = screen.getByRole('button', {
    name: `Piilota alatapahtumat: ${eventName}`,
  });
  await user.click(hideUmbrellaButton);

  await eventsShouldBeVisible([eventName]);

  eventsShouldBeHidden([
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const showUmbrellaButton = screen.getByRole('button', {
    name: `Näytä alatapahtumat: ${eventName}`,
  });
  await user.click(showUmbrellaButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);

  const hideRecurringButton = screen.getByRole('button', {
    name: `Piilota alatapahtumat: ${subSubEventFields[0].name}`,
  });
  await user.click(hideRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
  ]);

  eventsShouldBeHidden(map(subSubSubEventFields, 'name'));

  const showRecurringButton = screen.getByRole('button', {
    name: `Näytä alatapahtumat: ${subSubEventFields[0].name}`,
  });
  await user.click(showRecurringButton);

  await eventsShouldBeVisible([
    eventName,
    ...map(subEventFields, 'name'),
    ...map(subSubEventFields, 'name'),
    ...map(subSubEventPage2Fields, 'name'),
    ...map(subSubSubEventFields, 'name'),
  ]);
});
