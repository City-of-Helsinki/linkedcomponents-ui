import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { findFooter } from './footer.components';

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Landing page footer')
  .page(getEnvUrl('/fi'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .requestHooks(requestLogger)
  .afterEach(async () => {
    requestLogger.clear();
  });

test('Footer links work', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const footer = await findFooter(t);
  const footerLinks = footer.footerLinks();
  // Events page
  await footerLinks.actions.clickEventsPageLink();
  await urlUtils.expectations.urlChangedToEventsPage();
  // Event search page
  await urlUtils.actions.navigateToLandingPage();
  await footerLinks.actions.clickEventSearchPageLink();
  await urlUtils.expectations.urlChangedToEventSearchPage();
  // Registrations page
  await urlUtils.actions.navigateToLandingPage();
  await footerLinks.actions.clickRegistrationsPageLink();
  await urlUtils.expectations.urlChangedToRegistrationsPage();
  // Support page
  await urlUtils.actions.navigateToLandingPage();
  await footerLinks.actions.clickSupportPageLink();
  await urlUtils.expectations.urlChangedToSupportPage();
  // Contact page
  await urlUtils.actions.navigateToLandingPage();
  await footerLinks.actions.clickContactPageLink();
  await urlUtils.expectations.urlChangedToContactPage();
});
