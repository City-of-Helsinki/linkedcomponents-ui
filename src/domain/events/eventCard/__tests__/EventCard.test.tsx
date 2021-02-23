import range from 'lodash/range';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../constants';
import {
  EventsDocument,
  OrganizationDocument,
  PublicationStatus,
  SuperEventType,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeImages,
  fakeLanguages,
  fakeOffers,
  fakeOrganization,
  fakePlace,
} from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import EventCard, { testIds } from '../EventCard';

configure({ defaultHidden: true });

const imageUrl = 'http://imageurl.com';
const organizationId = 'hel:123';

const eventValues = {
  id: 'event:1',
  addressLocality: 'Helsinki',
  audienceMaxAge: 18,
  audienceMinAge: 12,
  endTime: '2021-01-23T12:00:00+00:00',
  inLanguage: 'Suomi',
  locationName: 'Location name',
  publicationStatus: PublicationStatus.Public,
  publisher: organizationId,
  name: 'Event name',
  streetAddress: 'Street address',
  startTime: '2021-01-04T12:00:00+00:00',
};

const organizationName = 'Organization name';
const organization = fakeOrganization({ name: organizationName });
const organizationResponse = { data: { organization } };
const organizationVariables = { id: organizationId, createPath: undefined };

const commonEventInfo = {
  id: eventValues.id,
  audienceMaxAge: eventValues.audienceMaxAge,
  audienceMinAge: eventValues.audienceMinAge,
  images: fakeImages(1, [{ url: imageUrl }]).data,
  inLanguage: fakeLanguages(1, [{ name: { fi: eventValues.inLanguage } }]).data,
  location: fakePlace({
    addressLocality: { fi: eventValues.addressLocality },
    name: { fi: eventValues.locationName },
    streetAddress: { fi: eventValues.streetAddress },
  }),
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

const subEventsResponse = { data: { events: subEvents } };
const subEventsVariables = {
  createPath: undefined,
  pageSize: MAX_PAGE_SIZE,
  showAll: true,
  superEvent: eventValues.id,
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
  {
    request: {
      query: EventsDocument,
      variables: subEventsVariables,
    },
    result: subEventsResponse,
  },
  {
    request: {
      query: OrganizationDocument,
      variables: organizationVariables,
    },
    result: organizationResponse,
  },
];

test('should render event card fields', async () => {
  render(<EventCard event={event} />, { mocks });

  await screen.findByRole('heading', { name: eventValues.name });
  const imageWrapper = screen.getByTestId(testIds.image);
  expect(imageWrapper.style.backgroundImage).toBe('url(http://imageurl.com)');
  screen.getByText('04.01.2021 – 23.01.2021');
  screen.getByText(eventValues.inLanguage);
  screen.getByText('Location name, Street address, Helsinki');
  await screen.findByText(organizationName);
  screen.getByText('Maksuton');
  screen.getByText('12 – 18 v');
  screen.getByText('Julkaistu');

  const showMoreButton = await screen.findByRole('button', {
    name: `Näytä alatapahtumat (${subEvents.data.length})`,
  });
  userEvent.click(showMoreButton);

  // Should show sub-events
  for (const { name } of subEventFields) {
    await screen.findByRole('heading', { name });
  }

  const hideButton = await screen.findByRole('button', {
    name: `Piilota alatapahtumat`,
  });
  userEvent.click(hideButton);

  // Sub-events should be hidden
  for (const { name } of subEventFields) {
    expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
  }
});
