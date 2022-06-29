/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RequestLogger } from 'testcafe';

import { SUPPORTED_LANGUAGES } from '../../src/constants';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { getKeywords } from '../data/keywordData';
import { isFeatureEnabled } from '../utils/featureFlag.utils';
import { isLocalized } from '../utils/keyword.utils';
import { getRandomSentence } from '../utils/random.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getKeywordsPage } from './keywords.components';

const keywordsLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Keywords page')
  .page(getEnvUrl('/fi/administration/keywords'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .after(async () => {
    requestLogger.clear();
    keywordsLogger.clear();
  })
  .requestHooks([requestLogger, keywordsLogger]);

if (isFeatureEnabled('SHOW_ADMIN')) {
  test('Create keyword button works', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const keywordsPage = await getKeywordsPage(t);

    await keywordsPage.actions.clickCreateKeywordButton();
    await urlUtils.actions.forceReload();
    await urlUtils.expectations.urlChangedToCreateKeywordPage();
  });

  test.disablePageReloads(
    'Search url by keyword name shows keyword row data for a keyword',
    async (t) => {
      const keywordsPage = await getKeywordsPage(t);
      await keywordsPage.pageIsLoaded();

      const locale = SUPPORTED_LANGUAGES.FI;
      const keywords = await getKeywords(t, keywordsLogger);
      const [keyword] = keywords.filter((keyword) =>
        isLocalized(keyword, locale)
      );

      await urlUtils.actions.navigateToKeywordsUrl(
        getRandomSentence(keyword.name?.fi as string)
      );

      const searchResults = await keywordsPage.findSearchResultList();
      const keywordRow = await searchResults.keywordRow(keyword);

      await keywordRow.actions.clickKeywordRow();
      await urlUtils.actions.forceReload();
      await urlUtils.expectations.urlChangedToKeywordPage(keyword);
    }
  );
}
