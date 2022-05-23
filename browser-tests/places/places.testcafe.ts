/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RequestLogger } from 'testcafe';

import { SUPPORTED_LANGUAGES } from '../../src/constants';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { getPlaces } from '../data/placeData';
import { isFeatureEnabled } from '../utils/featureFlag.utils';
import { isLocalized } from '../utils/place.utils';
import { getRandomSentence } from '../utils/random.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getPlacesPage } from './places.components';

const placesLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Places page')
  .page(getEnvUrl('/fi/administration/places'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .afterEach(async () => {
    requestLogger.clear();
    placesLogger.clear();
  })
  .requestHooks([requestLogger, placesLogger]);

if (isFeatureEnabled('SHOW_ADMIN')) {
  test('Create place button works', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const keywordsPage = await getPlacesPage(t);
    await keywordsPage.actions.clickCreatePlaceButton();
    await urlUtils.expectations.urlChangedToCreatePlacePage();
  });

  test('Search url by place name shows place row data for a place', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const placesPage = await getPlacesPage(t);
    await placesPage.pageIsLoaded();

    const locale = SUPPORTED_LANGUAGES.FI;
    const places = await getPlaces(t, placesLogger);
    const [place] = places.filter((place) => isLocalized(place, locale));

    await urlUtils.actions.navigateToPlacesUrl(
      getRandomSentence(place.name.fi)
    );

    const searchResults = await placesPage.findSearchResultList();
    const placeRow = await searchResults.placeRow(place);

    await placeRow.actions.clickPlaceRow();
    await urlUtils.expectations.urlChangedToPlacePage(place);
  });
}
