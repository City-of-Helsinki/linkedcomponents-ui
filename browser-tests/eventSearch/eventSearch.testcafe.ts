/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController, { RequestLogger } from 'testcafe';

import { SUPPORTED_LANGUAGES, supportedLanguages } from '../../src/constants';
import { EventFieldsFragment } from '../../src/generated/graphql';
import getValue from '../../src/utils/getValue';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import {
  getEvents,
  getPlace,
  getPlaces,
  getPublisher,
} from '../data/eventData';
import { getExpectedEventContext, isLocalized } from '../utils/event.utils';
import { isInternetLocation } from '../utils/place.utils';
import {
  getRandomSentence,
  selectRandomValuesFromArray,
} from '../utils/random.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import {
  clearDataToPrintOnFailure,
  setDataToPrintOnFailure,
} from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getEventSearchPage } from './eventSearch.components';

const eventSearchLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let eventSearchPage: ReturnType<typeof getEventSearchPage>;
let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Event search page')
  .page(getEnvUrl('/fi/search'))
  .beforeEach(async (t) => {
    urlUtils = getUrlUtils(t);
    await urlUtils.actions.navigateToSearchUrl('');

    clearDataToPrintOnFailure(t);
    eventSearchPage = getEventSearchPage(t);
  })
  .after(async () => {
    requestLogger.clear();
    eventSearchLogger.clear();
  })
  .requestHooks([requestLogger, eventSearchLogger]);

test('shows places in filter options', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  await eventSearchPage.pageIsLoaded();

  const places = await getPlaces(t, eventSearchLogger);
  await t.expect(places.length).gt(0);

  const searchBanner = await eventSearchPage.findSearchBanner();
  await searchBanner.actions.openPlaceFilters();

  for (const place of selectRandomValuesFromArray(places, 3)) {
    await searchBanner.actions.selectPlaceFilter(place);
  }
});

test.disablePageReloads(
  'Search url by event name shows event card data for an event',
  async (t) => {
    await eventSearchPage.pageIsLoaded();

    const locale = SUPPORTED_LANGUAGES.FI;
    const events = await getEvents(t, eventSearchLogger);
    const [event] = events.filter((event) => isLocalized(event, locale));

    if (!event) {
      return;
    }

    const eventPublisher = await getPublisher(t, eventSearchLogger, event);
    const eventLocation = await getPlace(t, eventSearchLogger, event);

    setDataToPrintOnFailure(
      t,
      'expectedEvent',
      getExpectedEventContext(event, 'startTime', 'endTime')
    );

    await urlUtils.actions.navigateToSearchUrl(
      getRandomSentence(getValue(event.name?.fi, ''))
    );
    const searchResults = await eventSearchPage.findSearchResultList();
    const eventCard = await searchResults.eventCard(event);
    if (eventPublisher) {
      await eventCard.expectations.publisherIsPresent(eventPublisher);
    }

    if (!isInternetLocation(eventLocation)) {
      await eventCard.expectations.addressIsPresent(eventLocation);
    }

    await eventCard.actions.clickEventLink();
    await urlUtils.expectations.urlChangedToEventPage(event);
  }
);

test.disablePageReloads(
  'Free text search finds event by free text search',
  async (t) => {
    await eventSearchPage.pageIsLoaded();

    const locale = SUPPORTED_LANGUAGES.FI;
    const events = await getEvents(t, eventSearchLogger);
    const [event] = events.filter((event) => isLocalized(event, locale));

    if (!event) {
      return;
    }

    const eventLocation = await getPlace(t, eventSearchLogger, event);

    setDataToPrintOnFailure(t, 'expectedEvent', getExpectedEventContext(event));
    const eventLanguages = supportedLanguages.filter((locale) =>
      isLocalized(event, locale)
    );

    for (const locale of eventLanguages) {
      const {
        description,
        locationName,
        name,
        shortDescription,
        streetAddress,
      } = {
        description: event.description?.[locale]?.trim(),
        locationName: eventLocation.name?.[locale]?.trim(),
        name: event.name?.[locale]?.trim(),
        shortDescription: event.shortDescription?.[locale]?.trim(),
        streetAddress: eventLocation.streetAddress?.[locale]?.trim(),
      };

      if (name) {
        await testSearchEventByText(t, event, name, 'name');
      }

      if (shortDescription) {
        await testSearchEventByText(
          t,
          event,
          shortDescription,
          'shortDescription'
        );
      }

      if (description) {
        await testSearchEventByText(t, event, description, 'description');
      }

      const eventWithLocation = {
        ...event,
        location: eventLocation,
      };

      if (locationName) {
        await testSearchEventByText(
          t,
          eventWithLocation,
          locationName,
          'location'
        );
      }

      if (!isInternetLocation(eventLocation) && streetAddress) {
        await testSearchEventByText(
          t,
          eventWithLocation,
          getValue(eventLocation.streetAddress?.[locale], ''),
          'location'
        );
      }
    }
  }
);

const testSearchEventByText = async (
  t: TestController,
  event: EventFieldsFragment,
  freeText: string,
  expectedField?: keyof EventFieldsFragment
) => {
  if (!freeText) {
    return;
  }
  const randomSentenceFromText = getRandomSentence(freeText);
  const searchBanner = await eventSearchPage.findSearchBanner();
  await searchBanner.actions.inputSearchTextAndPressEnter(
    randomSentenceFromText
  );
  const searchResults = await eventSearchPage.findSearchResultList();
  await searchResults.eventCard(event, expectedField);
  await searchBanner.actions.clickClearFiltersButton();
  clearDataToPrintOnFailure(t);
};
