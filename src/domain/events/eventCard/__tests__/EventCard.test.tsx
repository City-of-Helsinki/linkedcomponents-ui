import range from 'lodash/range';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../constants';
import {
  EventsDocument,
  OrganizationDocument,
  OrganizationsDocument,
  PlaceDocument,
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
  fakeOrganizations,
  fakePlace,
} from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { SUB_EVENTS_VARIABLES } from '../../../event/constants';
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
  locationId: 'place:1',
  locationName: 'Location name',
  publicationStatus: PublicationStatus.Public,
  publisher: organizationId,
  name: 'Event name',
  streetAddress: 'Street address',
  startTime: '2021-01-04T12:00:00+00:00',
};

const organizationName = 'Organization name';
const organization = fakeOrganization({
  id: organizationId,
  name: organizationName,
});
const organizationVariables = { id: organizationId, createPath: undefined };
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse = {
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
const mockedOrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const place = fakePlace({
  addressLocality: { fi: eventValues.addressLocality },
  id: eventValues.locationId,
  name: { fi: eventValues.locationName },
  streetAddress: { fi: eventValues.streetAddress },
});
const placeVariables = {
  createPath: undefined,
  id: eventValues.locationId,
};
const placeResponse = { data: { place } };
const mockedPlaceResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
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
  mockedSubEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  mockedPlaceResponse,
];

test('should render event card fields', async () => {
  render(<EventCard event={event} />, { mocks });

  screen.getByRole('heading', { name: eventValues.name });
  const imageWrapper = screen.getByTestId(testIds.image);
  expect(imageWrapper.style.backgroundImage).toBe('url(http://imageurl.com)');
  expect(screen.getAllByText('04.01.2021 – 23.01.2021')).toHaveLength(2);
  screen.getByText(eventValues.inLanguage);
  const locationTexts = await screen.findAllByText(
    'Location name, Street address, Helsinki'
  );
  expect(locationTexts).toHaveLength(2);
  await screen.findByText(organizationName);
  screen.getByText('Maksuton');
  screen.getByText('12 – 18 v');
  expect(screen.getAllByText('Julkaistu')).toHaveLength(2);

  const showMoreButton = screen.getByRole('button', {
    name: `Näytä alatapahtumat (${subEvents.data.length})`,
  });
  userEvent.click(showMoreButton);

  // Should show sub-events
  await screen.findByRole('heading', { name: subEventFields[0].name });
  for (const { name } of subEventFields.slice(1)) {
    await screen.findByRole('heading', { name });
  }

  const hideButton = screen.getByRole('button', {
    name: `Piilota alatapahtumat`,
  });
  userEvent.click(hideButton);

  // Sub-events should be hidden
  for (const { name } of subEventFields) {
    expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
  }
});
