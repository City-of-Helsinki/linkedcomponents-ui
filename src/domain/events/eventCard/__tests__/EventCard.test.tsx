import React from 'react';

import {
  OrganizationDocument,
  PublicationStatus,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeImages,
  fakeLanguages,
  fakeOffers,
  fakeOrganization,
  fakePlace,
} from '../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../utils/testUtils';
import EventCard, { testIds } from '../EventCard';

configure({ defaultHidden: true });

const imageUrl = 'http://imageurl.com';
const organizationId = 'hel:123';
const eventValues = {
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
const variables = { id: organizationId, createPath: undefined };

const mocks = [
  {
    request: {
      query: OrganizationDocument,
      variables,
    },
    result: organizationResponse,
  },
];

const event = fakeEvent({
  audienceMaxAge: eventValues.audienceMaxAge,
  audienceMinAge: eventValues.audienceMinAge,
  endTime: eventValues.endTime,
  images: fakeImages(1, [{ url: imageUrl }]).data,
  inLanguage: fakeLanguages(1, [{ name: { fi: eventValues.inLanguage } }]).data,
  location: fakePlace({
    addressLocality: { fi: eventValues.addressLocality },
    name: { fi: eventValues.locationName },
    streetAddress: { fi: eventValues.streetAddress },
  }),
  name: { fi: eventValues.name },
  offers: fakeOffers(1, [{ isFree: true }]),
  publicationStatus: eventValues.publicationStatus,
  publisher: eventValues.publisher,
  startTime: eventValues.startTime,
});

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
});
