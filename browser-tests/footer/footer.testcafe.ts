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
  // // Event search page
  await footerLinks.actions.clickSearchEventsPageLink();
  await urlUtils.expectations.urlChangedToSearchEventsPage();

  // Own events page
  await footerLinks.actions.clickOwnEventsPageLink();
  await urlUtils.expectations.urlChangedToOwnEventsPage();

  // Create event page
  await footerLinks.actions.clickCreateEventPageLink();
  await urlUtils.expectations.urlChangedToCreateEventPage();

  // Instructions page
  await footerLinks.actions.clickInstructionsPageLink();
  await urlUtils.expectations.urlChangedToInstructionsPage();

  // Platform page
  await footerLinks.actions.clickPlatformPageLink();
  await urlUtils.expectations.urlChangedToPlatformPage();

  // Control panel page
  await footerLinks.actions.clickControlPanelPageLink();
  await urlUtils.expectations.urlChangedToControlPanelPage();

  // Linked Registration instructions page
  await footerLinks.actions.clickRegistrationInstructionsPageLink();
  await urlUtils.expectations.urlChangedToRegistrationInstructionsPage();

  // FAQ page
  await footerLinks.actions.clickFaqPageLink();
  await urlUtils.expectations.urlChangedToFaqPage();

  // Technology page
  await footerLinks.actions.clickTechnologyPageLink();
  await urlUtils.expectations.urlChangedToTechnologyGeneralPage();

  // API page
  await footerLinks.actions.clickApiPageLink();
  await urlUtils.expectations.urlChangedToApiPage();

  // Image rights page
  await footerLinks.actions.clickImageRightsPageLink();
  await urlUtils.expectations.urlChangedToImageRightsPage();

  // Source code page
  await footerLinks.actions.clickSourceCodePageLink();
  await urlUtils.expectations.urlChangedToSourceCodePage();

  // Documentation page
  await footerLinks.actions.clickDocumentationPageLink();
  await urlUtils.expectations.urlChangedToDocumentationPage();

  // Support page
  await footerLinks.actions.clickSupportPageLink();
  await urlUtils.expectations.urlChangedToSupportPage();

  // Terms of use page
  await footerLinks.actions.clickTermsOfUsePageLink();
  await urlUtils.expectations.urlChangedToTermsOfUsePage();

  // Contact page
  await footerLinks.actions.clickContactPageLink();
  await urlUtils.expectations.urlChangedToContactPage();

  // Ask permission page
  await footerLinks.actions.clickAskPermissionLink();
  await urlUtils.expectations.urlChangedToAskPermissionPage();

  // Features page
  await footerLinks.actions.clickFeaturesLink();
  await urlUtils.expectations.urlChangedToFeaturesPage();

  // Accessibility page
  await footerLinks.actions.clickAccessibilityLink();
  await urlUtils.expectations.urlChangedToAccessibilityPage();
});
