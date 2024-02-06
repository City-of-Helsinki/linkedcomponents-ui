/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController, { ClientFunction } from 'testcafe';

import { EventFieldsFragment } from '../../src/generated/graphql';
import { getCommonComponents } from '../common.components';
import { getEnvUrl } from './settings';
import { getErrorMessage, setDataToPrintOnFailure } from './testcafe.utils';

const getPathname = ClientFunction(() => document.location.pathname);
const getPageTitle = ClientFunction(() => document.title);

export const getUrlUtils = (t: TestController) => {
  const pageIsLoaded = async () => {
    await getCommonComponents(t)
      .loadingSpinner()
      .expectations.isNotPresent({ timeout: 20000 });
  };

  const actions = {
    async navigateToEventsPage() {
      await t.navigateTo(getEnvUrl(`/fi/events`));
    },
    async navigateToLandingPage() {
      await t.navigateTo(getEnvUrl(`/fi`));
    },
    async navigateToSearchUrl(searchString: string) {
      const query = searchString
        ? `?text=${encodeURIComponent(searchString)}`
        : '';
      const url = getEnvUrl(`/fi/search${query}`);
      setDataToPrintOnFailure(t, 'url', url);
      await t.navigateTo(url);
    },
    async navigateToSupportPage() {
      await t.navigateTo(getEnvUrl(`/fi/help`));
    },
  };

  const expectations = {
    async pathnameEquals(url: string) {
      await t.expect(getPathname()).eql(url, await getErrorMessage(t));
    },
    async pageTitleEquals(title: string) {
      await t.expect(getPageTitle()).eql(title, await getErrorMessage(t));
    },
    async urlChangedToAccessibilityPage() {
      await expectations.pathnameEquals('/fi/accessibility-statement');
    },
    async urlChangedToApiPage() {
      await expectations.pathnameEquals('/fi/help/technology/api');
    },
    async urlChangedToAskPermissionPage() {
      await expectations.pathnameEquals('/fi/help/support/ask-permission');
    },
    async urlChangedToContactPage() {
      await expectations.pathnameEquals('/fi/help/support/contact');
    },
    async urlChangedToControlPanelPage() {
      await expectations.pathnameEquals('/fi/help/instructions/control-panel');
    },
    async urlChangedToCreateEventPage() {
      await expectations.pathnameEquals('/fi/events/create');
    },
    async urlChangedToDocumentationPage() {
      await expectations.pathnameEquals('/fi/help/technology/documentation');
    },
    async urlChangedToEventPage(event: EventFieldsFragment) {
      setDataToPrintOnFailure(t, 'expectedEvent', event);
      await expectations.pathnameEquals(`/fi/events/edit/${event.id}`);
      await pageIsLoaded();
      await expectations.pageTitleEquals(`${event.name?.fi} - Linked Events`);
    },
    async urlChangedToFaqPage() {
      await expectations.pathnameEquals('/fi/help/instructions/faq');
    },
    async urlChangedToFeaturesPage() {
      await expectations.pathnameEquals('/fi/help/features');
    },
    async urlChangedToImageRightsPage() {
      await expectations.pathnameEquals('/fi/help/technology/image-rights');
    },
    async urlChangedToInstructionsPage() {
      await expectations.pathnameEquals('/fi/help/instructions/general');
    },
    async urlChangedToLandingPage() {
      await expectations.pathnameEquals('/fi');
    },
    async urlChangedToOwnEventsPage() {
      await expectations.pathnameEquals('/fi/events');
    },
    async urlChangedToPlatformPage() {
      await expectations.pathnameEquals('/fi/help/instructions/platform');
    },
    async urlChangedToRegistrationInstructionsPage() {
      await expectations.pathnameEquals('/fi/help/instructions/registration');
    },
    async urlChangedToSearchEventsPage() {
      await expectations.pathnameEquals('/fi/search');
    },
    async urlChangedToSourceCodePage() {
      await expectations.pathnameEquals('/fi/help/technology/source-code');
    },
    async urlChangedToSupportPage() {
      await expectations.pathnameEquals('/fi/help/support/terms-of-use');
    },
    async urlChangedToTechnologyGeneralPage() {
      await expectations.pathnameEquals('/fi/help/technology/general');
    },
    async urlChangedToTermsOfUsePage() {
      await expectations.pathnameEquals('/fi/help/support/terms-of-use');
    },
  };

  return { actions, expectations };
};
