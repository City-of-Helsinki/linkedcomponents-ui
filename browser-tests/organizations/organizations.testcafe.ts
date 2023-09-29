/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RequestLogger } from 'testcafe';

import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { getOrganizations } from '../data/organizationData';
import { isFeatureEnabled } from '../utils/featureFlag.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getOrganizationsPage } from './organizations.components';

const organizationsLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Organizations page')
  .page(getEnvUrl('/fi/administration/organizations'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .afterEach(async () => {
    requestLogger.clear();
    organizationsLogger.clear();
  })
  .requestHooks([requestLogger, organizationsLogger]);

if (isFeatureEnabled('SHOW_ADMIN')) {
  test('Create organization button works', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const organizationsPage = await getOrganizationsPage(t);

    await organizationsPage.actions.clickCreateOrganizationButton();
    await urlUtils.expectations.urlChangedToCreateOrganizationPage();
  });

  test('Shows organization row data for an organization', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const organizationsPage = await getOrganizationsPage(t);
    await organizationsPage.pageIsLoaded();
    const organizations = await getOrganizations(t, organizationsLogger);

    const [organization] = organizations.filter(
      (organization) => organization.name && !organization.parentOrganization
    );

    const searchResults = await organizationsPage.findSearchResultList();
    const organizationRow = await searchResults.organizationRow(organization);

    await organizationRow.actions.clickOrganizationRow();
    await urlUtils.expectations.urlChangedToOrganizationPage(organization);
  });
}
