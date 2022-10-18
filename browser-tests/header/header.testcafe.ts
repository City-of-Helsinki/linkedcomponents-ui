import { SUPPORTED_LANGUAGES } from '../../src/constants';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { isFeatureEnabled } from '../utils/featureFlag.utils';
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
  // Search input field
  await urlUtils.actions.navigateToLandingPage();
  const headerSearch = header.headerSearch();
  await headerSearch.actions.clickSearchButton();
  await headerSearch.actions.clickSearchInput();

  await t.pressKey('enter');
  await urlUtils.actions.forceReload();
  await urlUtils.expectations.urlChangedToEventSearchPage();

  // Events page
  await headerTabs.actions.clickEventsPageTab();
  await urlUtils.actions.forceReload();
  await urlUtils.expectations.urlChangedToEventsPage();
  // Registrations page
  if (isFeatureEnabled('SHOW_REGISTRATION')) {
    await headerTabs.actions.clickRegistrationsPageTab();
    await urlUtils.actions.forceReload();
    await urlUtils.expectations.urlChangedToRegistrationsPage();
  }
  // Admin page
  if (isFeatureEnabled('SHOW_ADMIN')) {
    await headerTabs.actions.clickAdminPageTab();
    await urlUtils.actions.forceReload();
    await urlUtils.expectations.urlChangedToKeywordsPage();
  }
  // Support page
  await headerTabs.actions.clickSupportPageTab();
  await urlUtils.actions.forceReload();
  await urlUtils.expectations.urlChangedToSupportPage();
});
