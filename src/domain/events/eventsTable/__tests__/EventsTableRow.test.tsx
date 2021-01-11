import React from 'react';

import {
  OrganizationDocument,
  PublicationStatus,
} from '../../../../generated/graphql';
import { fakeEvent, fakeOrganization } from '../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../utils/testUtils';
import EventsTableRow from '../EventsTableRow';

configure({ defaultHidden: true });

test('should render event data correctly', async () => {
  const organizationId = 'hel:123';
  const organizationName = 'Organization name';
  const organization = fakeOrganization({ name: organizationName });
  const organizationResponse = { data: { organization } };

  const mocks = [
    {
      request: {
        query: OrganizationDocument,
        variables: { id: organizationId, createPath: undefined },
      },
      result: organizationResponse,
    },
  ];
  const id = 'event:123';
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

  render(
    <table>
      <tbody>
        <EventsTableRow event={event} />
      </tbody>
    </table>,
    { mocks }
  );

  expect(screen.getByText(id)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: eventName })).toBeInTheDocument();
  expect(screen.getAllByRole('cell', { name: eventName })).toHaveLength(2);
  await screen.findByRole('cell', { name: organizationName });
  expect(
    screen.getByRole('cell', { name: '08.11.2019 klo 12.27' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('cell', { name: '02.01.2020 klo 12.27' })
  ).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Julkaistu' })).toBeInTheDocument();
});
