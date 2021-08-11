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

test('Events page is navigable from landing page footer', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const footer = await findFooter(t);
  const footerLinks = footer.footerLinks();
  await footerLinks.actions.clickEventsPageLink();
  await urlUtils.expectations.urlChangedToEventsPage();
});

test('Events search page is navigable from landing page footer', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const footer = await findFooter(t);
  const footerLinks = footer.footerLinks();
  await footerLinks.actions.clickEventSearchPageLink();
  await urlUtils.expectations.urlChangedToEventSearchPage();
});

test('Support page is navigable from landing page footer', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const footer = await findFooter(t);
  const footerLinks = footer.footerLinks();
  await footerLinks.actions.clickSupportPageLink();
  await urlUtils.expectations.urlChangedToSupportPage();
});

test('Contact page is navigable from landing page footer', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const footer = await findFooter(t);
  const footerLinks = footer.footerLinks();
  await footerLinks.actions.clickContactPageLink();
  await urlUtils.expectations.urlChangedToContactPage();
});
