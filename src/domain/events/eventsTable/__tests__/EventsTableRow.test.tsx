import { MockedResponse } from '@apollo/react-testing';
import range from 'lodash/range';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../constants';
import {
  EventFieldsFragment,
  EventsDocument,
  OrganizationDocument,
  OrganizationsDocument,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeOrganization,
  fakeOrganizations,
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
const organizationVariables = { id: organizationId, createPath: undefined };
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: organizationVariables,
  },
  result: organizationResponse,
};

const organizationsVariables = {
  child: organizationId,
  pageSize: MAX_PAGE_SIZE,
  createPath: undefined,
};
const organizationsResponse = { data: { organizations: fakeOrganizations(0) } };
const mockedOrganizationsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const renderComponent = (event: EventFieldsFragment, mocks: MockedResponse[]) =>
  render(
    <table>
      <tbody>
        <EventsTableRow event={event} />
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

  const mocks = [mockedOrganizationResponse, mockedOrganizationsResponse];

  renderComponent(event, mocks);

  screen.getByRole('link', { name: eventValues.name });
  await screen.findByRole('cell', { name: organizationName });
  screen.getByRole('cell', { name: '08.11.2019 klo 12.27' });
  screen.getByRole('cell', { name: '02.01.2020 klo 12.27' });
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

  const subEventFields = range(1, 11).map((n) => ({
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
    createPath: undefined,
    pageSize: MAX_PAGE_SIZE,
    showAll: true,
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
    mockedOrganizationsResponse,
    mockedSubEventsResponse,
  ];

  renderComponent(event, mocks);

  const showMoreButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat: ${eventValues.name}`,
  });
  userEvent.click(showMoreButton);

  // Should show sub-events
  for (const { name } of subEventFields) {
    await screen.findByRole('link', { name });
  }

  const hideButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat: ${eventValues.name}`,
  });
  userEvent.click(hideButton);

  // Sub-events should be hidden
  for (const { name } of subEventFields) {
    expect(screen.queryByRole('link', { name })).not.toBeInTheDocument();
  }
});
