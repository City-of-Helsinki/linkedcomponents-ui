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
  await headerTabs.expectations.ownEventsPageTabIsVisible();
  await headerTabs.expectations.supportPageTabIsVisible();

  await languageSelector.actions.changeLanguage(SUPPORTED_LANGUAGES.EN);

  await headerTabs.expectations.ownEventsPageTabIsVisible();
  await headerTabs.expectations.supportPageTabIsVisible();
});

test('Header tabs field work', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();
  const header = await findHeader(t);
  const headerTabs = header.headerTabs();

  await urlUtils.actions.navigateToLandingPage();

  // Search events page
  await headerTabs.actions.clickSearchEventsPageTab();
  await urlUtils.expectations.urlChangedToSearchEventsPage();
  // Events page
  await headerTabs.actions.clickOwnEventsPageTab();
  await urlUtils.expectations.urlChangedToOwnEventsPage();
  // Support page
  await headerTabs.actions.clickSupportPageTab();
  await urlUtils.expectations.urlChangedToInstructionsPage();
});
