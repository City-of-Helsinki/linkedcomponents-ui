import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { EventDocument, PublicationStatus } from '../../../generated/graphql';
import { fakeEvent } from '../../../utils/mockDataUtils';
import {
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
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

const renderComponent = (mocks: MockedResponse[]) =>
  renderWithRoute(<EventSavedPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EVENT_SAVED,
  });

test('should render all components for draft event', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  renderComponent(mocks);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.eventSavedPage.titleDraftSaved,
      })
    ).toBeInTheDocument();
  });

  const buttons = [
    translations.eventSavedPage.buttonBackToEvents,
    translations.eventSavedPage.buttonAddEvent,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });
});

test('should render all components for published event', async () => {
  const mocks = getMocks(PublicationStatus.Public);

  renderComponent(mocks);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.eventSavedPage.titlePublished,
      })
    ).toBeInTheDocument();
  });

  const buttons = [
    translations.eventSavedPage.buttonBackToEvents,
    translations.eventSavedPage.buttonAddEvent,
  ];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });
});

test('should route to event list page', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  const { history } = renderComponent(mocks);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.eventSavedPage.titleDraftSaved,
      })
    ).toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', {
      name: translations.eventSavedPage.buttonBackToEvents,
    })
  );

  expect(history.location.pathname).toBe('/fi/events');
});

test('should route to create event page', async () => {
  const mocks = getMocks(PublicationStatus.Draft);
  const { history } = renderComponent(mocks);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.eventSavedPage.titleDraftSaved,
      })
    ).toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', {
      name: translations.eventSavedPage.buttonAddEvent,
    })
  );

  expect(history.location.pathname).toBe('/fi/event/create');
});
