import { SUPPORTED_LANGUAGES } from '../../src/constants';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { findHeader } from './header.components';

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Landing page header')
  .page(getEnvUrl('/fi'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .requestHooks(requestLogger)
  .afterEach(async () => {
    requestLogger.clear();
  });

test('Changing language on landing page', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const header = await findHeader(t);
  const headerTabs = header.headerTabs();
  const languageSelector = header.languageSelector();
  await headerTabs.expectations.eventsPageTabIsVisible();
  await headerTabs.expectations.supportPageTabIsVisible();

  await languageSelector.actions.changeLanguage(SUPPORTED_LANGUAGES.EN);

  await headerTabs.expectations.eventsPageTabIsVisible();
  await headerTabs.expectations.supportPageTabIsVisible();
});

test('Header tabs and search input field work', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const header = await findHeader(t);
  const headerTabs = header.headerTabs();
  // Events page
  await headerTabs.actions.clickEventsPageTab();
  await urlUtils.expectations.urlChangedToEventsPage();
  // Support page
  await headerTabs.actions.clickSupportPageTab();
  await urlUtils.expectations.urlChangedToSupportPage();
  // Search input field
  const headerSearch = header.headerSearch();
  await headerSearch.actions.clickSearchButton();
  await headerSearch.actions.clickSearchInput();
  await t.pressKey('enter');
  await urlUtils.expectations.urlChangedToEventSearchPage();
});
