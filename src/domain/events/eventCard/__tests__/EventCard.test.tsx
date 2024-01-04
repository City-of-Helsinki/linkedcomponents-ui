import range from 'lodash/range';
import React from 'react';

import { testIds } from '../../../../constants';
import {
  EventsDocument,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeImages,
  fakeLanguages,
  fakeOffers,
} from '../../../../utils/mockDataUtils';
import { mockUnauthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { SUB_EVENTS_VARIABLES } from '../../../event/constants';
import {
  mockedOrganizationResponse,
  organizationId,
  organizationName,
} from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  addressLocality,
  mockedPlaceResponse,
  place,
  placeName,
  streetAddress,
} from '../../../place/__mocks__/place';
import EventCard from '../EventCard';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const imageUrl = 'http://imageurl.com';
const locationText = [placeName, streetAddress, addressLocality].join(', ');

const eventValues = {
  id: 'event:1',
  audienceMaxAge: 18,
  audienceMinAge: 12,
  endTime: '2021-01-23T12:00:00+00:00',
  inLanguage: 'Suomi',
  publicationStatus: PublicationStatus.Public,
  publisher: organizationId,
  name: 'Event name',
  streetAddress: 'Street address',
  startTime: '2021-01-04T12:00:00+00:00',
};

const commonEventInfo = {
  id: eventValues.id,
  audienceMaxAge: eventValues.audienceMaxAge,
  audienceMinAge: eventValues.audienceMinAge,
  images: fakeImages(1, [{ url: imageUrl }]).data,
  inLanguage: fakeLanguages(1, [{ name: { fi: eventValues.inLanguage } }]).data,
  location: place,
  offers: fakeOffers(1, [{ isFree: true }]),
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
  ...SUB_EVENTS_VARIABLES,
  superEvent: eventValues.id,
};
const subEventsResponse = { data: { events: subEvents } };
const mockedSubEventsResponse = {
  request: { query: EventsDocument, variables: subEventsVariables },
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
  mockedSubEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
];

test('should render event card fields', async () => {
  const user = userEvent.setup();
  render(<EventCard event={event} />, { mocks });

  screen.getByRole('heading', { name: eventValues.name });
  const imageWrapper = screen.getByTestId(testIds.eventCard.image);
  expect(imageWrapper.style.backgroundImage).toBe('url(http://imageurl.com)');
  expect(screen.getAllByText('4.1.2021 – 23.1.2021')).toHaveLength(2);
  screen.getByText(eventValues.inLanguage);
  const locationTexts = await screen.findAllByText(locationText);
  expect(locationTexts).toHaveLength(2);
  await screen.findByText(organizationName);
  screen.getByText('Maksuton');
  screen.getByText('12 – 18 v');
  expect(screen.getAllByText('Julkaistu')).toHaveLength(2);

  const showMoreButton = screen.getByRole('button', {
    name: `Näytä alatapahtumat (${subEvents.data.length})`,
  });
  await user.click(showMoreButton);

  // Should show sub-events
  await screen.findByRole('heading', { name: subEventFields[0].name });
  for (const { name } of subEventFields.slice(1)) {
    await screen.findByRole('heading', { name });
  }

  const hideButton = screen.getByRole('button', {
    name: `Piilota alatapahtumat`,
  });
  await user.click(hideButton);

  // Sub-events should be hidden
  for (const { name } of subEventFields) {
    expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
  }
});
