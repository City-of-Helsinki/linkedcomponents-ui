import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { findHelpPages } from './help.components';

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Help page')
  .page(getEnvUrl('/fi/help'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .requestHooks(requestLogger)
  .afterEach(async () => {
    requestLogger.clear();
  });

test('Side navigation tabs work', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const helpPage = await findHelpPages(t);
  const sideNavigation = helpPage.sideNavigation();
  const helpPageTitles = helpPage.helpPageTitles();

  await urlUtils.expectations.urlChangedToSupportPage();
  // Fearures tab
  await sideNavigation.actions.clickFeaturesTab();
  await urlUtils.expectations.urlChangedToFeaturesPage();
  await helpPageTitles.expectations.featuresTitleIsVisible();
  // Support tab
  await sideNavigation.actions.clickSupportTab();
  await urlUtils.expectations.urlChangedToTermsOfUsePage();
  await helpPageTitles.expectations.termsOfUseTitleIsVisible();
  // Contact tab
  await sideNavigation.actions.clickContactTab();
  await urlUtils.expectations.urlChangedToContactPage();
  await helpPageTitles.expectations.contactTitleIsVisible();
  // Terms of use tab
  await sideNavigation.actions.clickTermsOfUseTab();
  await urlUtils.expectations.urlChangedToTermsOfUsePage();
  await helpPageTitles.expectations.termsOfUseTitleIsVisible();
  // Techonology tab
  await sideNavigation.actions.clickTechnologyTab();
  await urlUtils.expectations.urlChangedToTechnologyGeneralPage();
  await helpPageTitles.expectations.technologyGeneralTitleIsVisible();
  // Documentation tab
  await sideNavigation.actions.clickDocumentationTab();
  await urlUtils.expectations.urlChangedToDocumentationPage();
  await helpPageTitles.expectations.documenationTitleIsVisible({
    timeout: 20000,
  });
  // Source code tab
  await sideNavigation.actions.clickSourceCodeTab();
  await urlUtils.expectations.urlChangedToSourceCodePage();
  await helpPageTitles.expectations.sourceCodeTitleIsVisible();
  // Image rights tab
  await sideNavigation.actions.clickImageRightsTab();
  await urlUtils.expectations.urlChangedToImageRightsPage();
  await helpPageTitles.expectations.imageRightsTitleIsVisible();
  // API tab
  await sideNavigation.actions.clickApiTab();
  await urlUtils.expectations.urlChangedToApiPage();
  await helpPageTitles.expectations.apiTitleIsVisible();
  // Technology general tab
  await sideNavigation.actions.clickTechnologyGeneralTab();
  await urlUtils.expectations.urlChangedToTechnologyGeneralPage();
  await helpPageTitles.expectations.technologyGeneralTitleIsVisible();
  // Instructions tab
  await sideNavigation.actions.clickInstructionsTab();
  await urlUtils.expectations.urlChangedToSupportPage();
  await helpPageTitles.expectations.instructionsGeneralTitleIsVisible();
  // FAQ tab
  await sideNavigation.actions.clickFaqTab();
  await urlUtils.expectations.urlChangedToFaqPage();
  await helpPageTitles.expectations.faqTitleIsVisible();
  // Control panel tab
  await sideNavigation.actions.clickControlPanelTab();
  await urlUtils.expectations.urlChangedToControlPanelPage();
  await helpPageTitles.expectations.controlPanelTitleIsVisible();
  // Platform tab
  await sideNavigation.actions.clickPlatformTab();
  await urlUtils.expectations.urlChangedToPlatformPage();
  await helpPageTitles.expectations.platformTitleIsVisible();
  // Instructions general tab
  await sideNavigation.actions.clickInstructionsGeneralTab();
  await urlUtils.expectations.urlChangedToSupportPage();
  await helpPageTitles.expectations.instructionsGeneralTitleIsVisible();
});
