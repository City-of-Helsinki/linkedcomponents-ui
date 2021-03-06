import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { EventDocument, PublicationStatus } from '../../../generated/graphql';
import { fakeEvent } from '../../../utils/mockDataUtils';
import { renderWithRoute, screen, userEvent } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import EventSavedPage from '../EventSavedPage';

const eventId = 'hel:123';
const route = ROUTES.EVENT_SAVED.replace(':id', eventId);

const getMocks = (publicationStatus: PublicationStatus): MockedResponse[] => {
  const event = fakeEvent({ publicationStatus });
  const eventResponse = { data: { event: event } };

  return [
    {
      request: {
        query: EventDocument,
        variables: { id: eventId, createPath: undefined },
      },
      result: eventResponse,
    },
  ];
};

const findComponent = (
  key:
    | 'addEventButton'
    | 'backToEventsButton'
    | 'draftSavedHeading'
    | 'publishedHeading'
) => {
  switch (key) {
    case 'addEventButton':
      return screen.findByRole('button', {
        name: translations.common.buttonAddEvent,
      });
    case 'backToEventsButton':
      return screen.findByRole('button', {
        name: translations.eventSavedPage.buttonBackToEvents,
      });
    case 'draftSavedHeading':
      return screen.findByRole('heading', {
        name: translations.eventSavedPage.titleDraftSaved,
      });
    case 'publishedHeading':
      return screen.findByRole('heading', {
        name: translations.eventSavedPage.titlePublished,
      });
  }
};

const renderComponent = (mocks: MockedResponse[]) =>
  renderWithRoute(<EventSavedPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EVENT_SAVED,
  });

test('should render all components for draft event', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  renderComponent(mocks);

  await findComponent('draftSavedHeading');
  await findComponent('backToEventsButton');
  await findComponent('addEventButton');
});

test('should render all components for published event', async () => {
  const mocks = getMocks(PublicationStatus.Public);

  renderComponent(mocks);

  await findComponent('publishedHeading');
  await findComponent('backToEventsButton');
  await findComponent('addEventButton');
});

test('should route to event list page', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  const { history } = renderComponent(mocks);

  await findComponent('draftSavedHeading');

  const backToEventsButton = await findComponent('backToEventsButton');
  userEvent.click(backToEventsButton);

  expect(history.location.pathname).toBe('/fi/events');
});

test('should route to create event page', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  const { history } = renderComponent(mocks);

  await findComponent('draftSavedHeading');

  const addEventButton = await findComponent('addEventButton');
  userEvent.click(addEventButton);

  expect(history.location.pathname).toBe('/fi/events/create');
});
