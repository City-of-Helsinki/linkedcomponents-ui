/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RequestLogger } from 'testcafe';

import { SUPPORTED_LANGUAGES } from '../../src/constants';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { getKeywordSets } from '../data/keywordSetData';
import { isLocalized } from '../utils/keywordSet.utils';
import { getRandomSentence } from '../utils/random.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getKeywordSetsPage } from './keywordSets.components';

const keywordSetsLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Keyword set page')
  .page(getEnvUrl('/fi/admin/keyword-sets'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .afterEach(async () => {
    requestLogger.clear();
    keywordSetsLogger.clear();
  })
  .requestHooks([requestLogger, keywordSetsLogger]);

test('Create keyword set button works', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const keywordSetsPage = await getKeywordSetsPage(t);
  await keywordSetsPage.actions.clickCreateKeywordSetButton();
  await urlUtils.expectations.urlChangedToCreateKeywordSetPage();
});

test('Search url by keyword set name shows keyword set row data for an keyword set', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const keywordSetsPage = await getKeywordSetsPage(t);
  await keywordSetsPage.pageIsLoaded();

  const locale = SUPPORTED_LANGUAGES.FI;
  const keywordSets = await getKeywordSets(t, keywordSetsLogger);
  const [keywordSet] = keywordSets.filter((keywordSet) =>
    isLocalized(keywordSet, locale)
  );

  await urlUtils.actions.navigateToKeywordSetsUrl(
    getRandomSentence(keywordSet.name.fi)
  );

  const searchResults = await keywordSetsPage.findSearchResultList();
  const keywordSetRow = await searchResults.keywordSetRow(keywordSet);

  await keywordSetRow.actions.clickKeywordSetRow();
  await urlUtils.expectations.urlChangedToKeywordSetPage(keywordSet);
});
