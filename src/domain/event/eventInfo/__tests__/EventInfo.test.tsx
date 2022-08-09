import React from 'react';

import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import EventInfo from '../EventInfo';

const renderComponent = (event: EventFieldsFragment) =>
  render(<EventInfo event={event} />);

test('should render event info with creator info', () => {
  const event = fakeEvent({
    name: { fi: 'Event name' },
    createdBy: "Creator's name - organization",
    lastModifiedTime: '2021-01-04T12:00:00+00:00',
    publicationStatus: PublicationStatus.Public,
    superEventType: SuperEventType.Umbrella,
  });

  renderComponent(event);

  screen.getByText('Julkaistu');
  screen.getByRole('heading', { name: 'Event name' });
  screen.getByText('Kattotapahtuma');
  screen.getByText('4.1.2021 12.00');
  screen.getByText("Creator's name - organization");
});
