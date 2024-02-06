import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { findHelpPages } from './help.components';

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Help page')
  .page(getEnvUrl('/fi/help/instructions/general'))
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

  await urlUtils.expectations.urlChangedToInstructionsPage();
  // Close instructions main level
  await sideNavigation.actions.clickInstructionsButton();
  // Fearures link
  await sideNavigation.actions.clickFeaturesLink();
  await urlUtils.expectations.urlChangedToFeaturesPage();
  await helpPageTitles.expectations.featuresTitleIsVisible();
  // Open support main level
  await sideNavigation.actions.clickSupportButton();
  // Ask permission link
  await sideNavigation.actions.clickAskPermissionLink();
  await urlUtils.expectations.urlChangedToAskPermissionPage();
  await helpPageTitles.expectations.askPermissionTitleIsVisible();
  // Contact link
  await sideNavigation.actions.clickContactLink();
  await urlUtils.expectations.urlChangedToContactPage();
  await helpPageTitles.expectations.contactTitleIsVisible();
  // Terms of use link
  await sideNavigation.actions.clickTermsOfUseLink();
  await urlUtils.expectations.urlChangedToTermsOfUsePage();
  await helpPageTitles.expectations.termsOfUseTitleIsVisible();
  // Close support main level
  await sideNavigation.actions.clickSupportButton();
  // Open techonology main level
  await sideNavigation.actions.clickTechnologyButton();
  // Documentation link
  await sideNavigation.actions.clickDocumentationLink();
  await urlUtils.expectations.urlChangedToDocumentationPage();
  await helpPageTitles.expectations.documenationTitleIsVisible({
    timeout: 20000,
  });
  // Source code link
  await sideNavigation.actions.clickSourceCodeLink();
  await urlUtils.expectations.urlChangedToSourceCodePage();
  await helpPageTitles.expectations.sourceCodeTitleIsVisible();
  // Image rights link
  await sideNavigation.actions.clickImageRightsLink();
  await urlUtils.expectations.urlChangedToImageRightsPage();
  await helpPageTitles.expectations.imageRightsTitleIsVisible();
  // API link
  await sideNavigation.actions.clickApiLink();
  await urlUtils.expectations.urlChangedToApiPage();
  await helpPageTitles.expectations.apiTitleIsVisible();
  // Technology link
  await sideNavigation.actions.clickTechnologyGeneralLink();
  await urlUtils.expectations.urlChangedToTechnologyGeneralPage();
  await helpPageTitles.expectations.technologyGeneralTitleIsVisible();
  // Close techonology main level
  await sideNavigation.actions.clickTechnologyButton();
  // Open instructions main level
  await sideNavigation.actions.clickInstructionsButton();
  // FAQ link
  await sideNavigation.actions.clickFaqLink();
  await urlUtils.expectations.urlChangedToFaqPage();
  await helpPageTitles.expectations.faqTitleIsVisible();
  // Registration instructions link
  await sideNavigation.actions.clickRegistrationInstructionsLink();
  await urlUtils.expectations.urlChangedToRegistrationInstructionsPage();
  await helpPageTitles.expectations.registrationInstructionsTitleIsVisible();
  // Control panel link
  await sideNavigation.actions.clickControlPanelLink();
  await urlUtils.expectations.urlChangedToControlPanelPage();
  await helpPageTitles.expectations.controlPanelTitleIsVisible();
  // Platform link
  await sideNavigation.actions.clickPlatformLink();
  await urlUtils.expectations.urlChangedToPlatformPage();
  await helpPageTitles.expectations.platformTitleIsVisible();
  // Instructions general link
  await sideNavigation.actions.clickInstructionsGeneralLink();
  await urlUtils.expectations.urlChangedToInstructionsPage();
  await helpPageTitles.expectations.instructionsGeneralTitleIsVisible();
});
