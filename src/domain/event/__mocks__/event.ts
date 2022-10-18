import { EventDocument } from '../../../generated/graphql';
import {
  fakeEvent,
  fakeLocalisedObject,
  fakeOffers,
} from '../../../utils/mockDataUtils';
import { image } from '../../image/__mocks__/image';
import { keywordsResponse } from '../../keyword/__mocks__/keyword';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { place } from '../../place/__mocks__/place';
import { EVENT_INCLUDES, TEST_EVENT_ID } from '../constants';

const eventName = 'Event name';
const eventOverrides = {
  id: TEST_EVENT_ID,
  audienceMaxAge: 15,
  audienceMinAge: 8,
  description: fakeLocalisedObject('Event description'),
  endTime: '2020-07-13T12:00:00.000000Z',
  keywords: keywordsResponse.data,
  images: [image],
  name: fakeLocalisedObject(eventName),
  location: place,
  offers: fakeOffers(1, [
    { isFree: false, price: fakeLocalisedObject('Event price') },
  ]),
  publisher: TEST_PUBLISHER_ID,
  startTime: '2020-07-10T12:00:00.000000Z',
};
const locationName = place.name?.fi as string;
const streetAddress = place.streetAddress?.fi as string;
const addressLocality = place.addressLocality?.fi as string;
const locationText = [locationName, streetAddress, addressLocality].join(', ');

const event = fakeEvent(eventOverrides);
const eventVariables = {
  createPath: undefined,
  id: TEST_EVENT_ID,
  include: EVENT_INCLUDES,
};
const eventResponse = { data: { event } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

export { event, eventName, eventOverrides, locationText, mockedEventResponse };
