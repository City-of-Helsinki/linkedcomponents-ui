import React from 'react';

import { EventStatus, PublicationStatus } from '../../../../generated/graphql';
import { render, screen } from '../../../../utils/testUtils';
import StatusTag from '../StatusTag';

test('should render correct text when publication status is draft', () => {
  render(
    <StatusTag
      eventStatus={EventStatus.EventScheduled}
      publicationStatus={PublicationStatus.Draft}
    />
  );
  expect(screen.getByText('Luonnos')).toBeInTheDocument();
});

test('should render correct text when publication status is public', () => {
  render(
    <StatusTag
      eventStatus={EventStatus.EventScheduled}
      publicationStatus={PublicationStatus.Public}
    />
  );
  expect(screen.getByText('Julkaistu')).toBeInTheDocument();
});

test('should render correct text when event status is cancelled', () => {
  render(
    <StatusTag
      eventStatus={EventStatus.EventCancelled}
      publicationStatus={PublicationStatus.Public}
    />
  );
  expect(screen.getByText('Peruutettu')).toBeInTheDocument();
});

test('should render correct text when event status is postponed', () => {
  render(
    <StatusTag
      eventStatus={EventStatus.EventPostponed}
      publicationStatus={PublicationStatus.Public}
    />
  );
  expect(screen.getByText('Lykätty')).toBeInTheDocument();
});
