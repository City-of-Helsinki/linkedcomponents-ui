import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';
import React from 'react';

import {
  EventFieldsFragment,
  EventsDocument,
  PublicationStatus,
  SuperEventType,
} from '../../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { SUB_EVENTS_VARIABLES } from '../../../../event/constants';
import {
  mockedOrganizationResponse,
  organizationId,
  organizationName,
} from '../../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../../organization/__mocks__/organizationAncestors';
import EventsTableRow from '../EventsTableRow';

configure({ defaultHidden: true });

const renderComponent = (event: EventFieldsFragment, mocks: MockedResponse[]) =>
  render(
    <table>
      <tbody>
        <EventsTableRow event={event} onRowClick={jest.fn()} />
      </tbody>
    </table>,
    { mocks }
  );

const eventValues = {
  id: 'event:1',
  endTime: '2020-01-02T12:27:34+00:00',
  publicationStatus: PublicationStatus.Public,
  publisher: organizationId,
  name: 'Event name',
  startTime: '2019-11-08T12:27:34+00:00',
};

test('should render event data correctly', async () => {
  const event = fakeEvent({
    endTime: eventValues.endTime,
    id: eventValues.id,
    name: { fi: eventValues.name },
    publicationStatus: eventValues.publicationStatus,
    publisher: organizationId,
    startTime: eventValues.startTime,
  });

  const mocks = [
    mockedOrganizationResponse,
    mockedOrganizationAncestorsResponse,
  ];

  renderComponent(event, mocks);

  screen.getByRole('button', { name: eventValues.name });
  await screen.findByRole(
    'cell',
    { name: organizationName },
    { timeout: 10000 }
  );
  screen.getByRole('cell', { name: '8.11.2019 klo 12.27' });
  screen.getByRole('cell', { name: '2.1.2020 klo 12.27' });
  screen.getByRole('cell', { name: 'Julkaistu' });

  // Toggle button should not be visible
  expect(
    screen.queryByRole('button', {
      name: `Näytä alatapahtumat: ${eventValues.name}`,
    })
  ).not.toBeInTheDocument();
});

test('should show sub events', async () => {
  const commonEventInfo = {
    id: eventValues.id,
    publicationStatus: eventValues.publicationStatus,
    publisher: eventValues.publisher,
  };

  const subEventFields = range(1, 3).map((n) => ({
    id: `subevent:${n}`,
    name: `Sub-event ${n} name`,
  }));

  const subEvents = fakeEvents(
    subEventFields.length,
    subEventFields.map(({ id, name }) => ({
      ...commonEventInfo,
      id,
      name: { fi: name },
    }))
  );
  const subEventsVariables = {
    ...SUB_EVENTS_VARIABLES,
    superEvent: eventValues.id,
  };
  const subEventsResponse = { data: { events: subEvents } };
  const mockedSubEventsResponse: MockedResponse = {
    request: {
      query: EventsDocument,
      variables: subEventsVariables,
    },
    result: subEventsResponse,
  };

  const event = fakeEvent({
    ...commonEventInfo,
    id: eventValues.id,
    endTime: eventValues.endTime,
    name: { fi: eventValues.name },
    startTime: eventValues.startTime,
    superEventType: SuperEventType.Recurring,
    subEvents: subEvents.data,
  });

  const mocks = [
    mockedOrganizationResponse,
    mockedOrganizationAncestorsResponse,
    mockedSubEventsResponse,
  ];

  const user = userEvent.setup();
  renderComponent(event, mocks);

  const showMoreButton = screen.getByRole('button', {
    name: `Näytä alatapahtumat: ${eventValues.name}`,
  });
  await user.click(showMoreButton);

  // Should show sub-events
  await screen.findByRole('button', { name: subEventFields[0].name });
  for (const { name } of subEventFields.slice(1)) {
    screen.getByRole('button', { name });
  }

  const hideButton = screen.getByRole('button', {
    name: `Piilota alatapahtumat: ${eventValues.name}`,
  });
  await user.click(hideButton);

  // Sub-events should be hidden
  for (const { name } of subEventFields) {
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
  }
});

test('should have an icon highlighting that the event was created by external user', async () => {
  const user = userEvent.setup();
  const commonEventInfo = {
    id: eventValues.id,
    publicationStatus: eventValues.publicationStatus,
    publisher: 'others',
  };
  const event = fakeEvent({
    ...commonEventInfo,
    id: eventValues.id,
    endTime: eventValues.endTime,
    name: { fi: eventValues.name },
    startTime: eventValues.startTime,
    superEventType: SuperEventType.Recurring,
  });

  const mocks = [
    mockedOrganizationResponse,
    mockedOrganizationAncestorsResponse,
  ];

  renderComponent(event, mocks);

  expect(screen.getByText(/Muu/i)).toBeInTheDocument();
});
