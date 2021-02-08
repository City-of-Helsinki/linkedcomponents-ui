import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

import {
  EventFieldsFragment,
  EventsDocument,
  OrganizationDocument,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeOrganization,
} from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import EventsTableRow from '../EventsTableRow';

configure({ defaultHidden: true });

const organizationId = 'hel:123';
const organizationName = 'Organization name';
const organization = fakeOrganization({ name: organizationName });
const organizationResponse = { data: { organization } };

const renderComponent = (event: EventFieldsFragment, mocks: MockedResponse[]) =>
  render(
    <table>
      <tbody>
        <EventsTableRow event={event} />
      </tbody>
    </table>,
    { mocks }
  );

test('should render event data correctly', async () => {
  const id = 'event:1';
  const eventName = 'Event name';
  const endTime = '2020-01-02T12:27:34+00:00';
  const startTime = '2019-11-08T12:27:34+00:00';
  const event = fakeEvent({
    endTime,
    id,
    name: { fi: eventName },
    publicationStatus: PublicationStatus.Public,
    publisher: organizationId,
    startTime,
  });

  const mocks = [
    {
      request: {
        query: OrganizationDocument,
        variables: { id: organizationId, createPath: undefined },
      },
      result: organizationResponse,
    },
  ];

  renderComponent(event, mocks);

  screen.getByText(id);
  screen.getByRole('link', { name: eventName });
  screen.getAllByRole('cell', { name: eventName });
  await screen.findByRole('cell', { name: organizationName });
  screen.getByRole('cell', { name: '08.11.2019 klo 12.27' });
  screen.getByRole('cell', { name: '02.01.2020 klo 12.27' });
  screen.getByRole('cell', { name: 'Julkaistu' });
});

test('should show sub events', async () => {
  const subEventId = 'subevent:1';
  const subEventName = 'Sub event 1';
  const subEvents = fakeEvents(1, [
    {
      id: subEventId,
      name: { fi: subEventName },
      publisher: organizationId,
    },
  ]);

  const subEventPage2Id = 'subevent:2';
  const subEventPage2Name = 'Sub event 2';
  const subEventsPage2 = fakeEvents(1, [
    {
      id: subEventPage2Id,
      name: { fi: subEventPage2Name },
      publisher: organizationId,
    },
  ]);
  const count = subEvents.data.length + subEventsPage2.data.length;
  const subEventsResponse = {
    data: {
      events: {
        ...subEvents,
        meta: {
          ...subEvents.meta,
          count,
          next: 'http://localhost:8000/v1/event/?page=2',
        },
      },
    },
  };
  const subEventsPage2Response = {
    data: {
      events: {
        ...subEventsPage2,
        meta: {
          ...subEventsPage2.meta,
          count,
          previous: 'http://localhost:8000/v1/event/',
        },
      },
    },
  };

  const eventId = 'event:1';
  const eventName = 'Event name';
  const endTime = '2020-01-02T12:27:34+00:00';
  const startTime = '2019-11-08T12:27:34+00:00';
  const event = fakeEvent({
    endTime,
    id: eventId,
    name: { fi: eventName },
    publisher: organizationId,
    startTime,
    subEvents: subEvents.data,
    superEventType: SuperEventType.Recurring,
  });

  const subEventsVariables = {
    createPath: undefined,
    pageSize: 100,
    showAll: true,
    superEvent: eventId,
  };

  const mocks = [
    {
      request: {
        query: OrganizationDocument,
        variables: { id: organizationId, createPath: undefined },
      },
      result: organizationResponse,
    },
    {
      request: {
        query: EventsDocument,
        variables: subEventsVariables,
      },
      result: subEventsResponse,
    },
    {
      request: {
        query: EventsDocument,
        variables: {
          ...subEventsVariables,
          page: 2,
        },
      },
      result: subEventsPage2Response,
    },
  ];

  renderComponent(event, mocks);

  const toggleButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${eventName}`,
  });
  userEvent.click(toggleButton);

  await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${eventName}`,
  });
  await screen.findByRole('link', { name: subEventName });
  await screen.findByRole('link', { name: subEventPage2Name });
});
