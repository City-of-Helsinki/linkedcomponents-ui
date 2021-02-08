import React from 'react';

import { PublicationStatus, SuperEventType } from '../../../generated/graphql';
import { fakeEvent } from '../../../utils/mockDataUtils';
import { render, screen } from '../../../utils/testUtils';
import EventInfo from '../EventInfo';

test('should render event info', () => {
  const event = fakeEvent({
    name: { fi: 'Event name' },
    createdBy: "Creator's name - organization",
    lastModifiedTime: '2021-01-04T12:00:00+00:00',
    publicationStatus: PublicationStatus.Public,
    superEventType: SuperEventType.Umbrella,
  });

  render(<EventInfo event={event} />);

  screen.getByText('Julkaistu');
  screen.getByRole('heading', { name: 'Event name' });
  screen.getByText('Kattotapahtuma');
  screen.getByText('04.01.2021 12.00');
  screen.getByText("Creator's name - organization");
});
