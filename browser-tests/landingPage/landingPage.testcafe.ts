import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { findLandingPage } from './landingPage.components';

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Landing page')
  .page(getEnvUrl('/fi'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .afterEach(async () => {
    requestLogger.clear();
  })
  .requestHooks(requestLogger);

test('Landing page buttons work', async (t) => {
  const cookieConsentModal = await findCookieConsentModal(t);
  await cookieConsentModal.actions.acceptAllCookies();

  const landingPage = await findLandingPage(t);

  await landingPage.actions.clickCreateEventButton();
  await urlUtils.actions.forceReload();
  await urlUtils.expectations.urlChangedToCreateEventPage();

  await urlUtils.actions.navigateToLandingPage();
  await landingPage.actions.clickSearchEventsButton();
  await urlUtils.actions.forceReload();
  await urlUtils.expectations.urlChangedToEventSearchPage();
});
