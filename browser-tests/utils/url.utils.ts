/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController, { ClientFunction } from 'testcafe';

import { getEnvUrl } from './settings';
import { getErrorMessage } from './testcafe.utils';

const getPathname = ClientFunction(() => document.location.pathname);

export const getUrlUtils = (t: TestController) => {
  const actions = {
    async navigateToEventsPage() {
      await t.navigateTo(getEnvUrl(`/fi/events`));
    },
    async navigateToLandingPage() {
      await t.navigateTo(getEnvUrl(`/fi`));
    },
    async navigateToSupportPage() {
      await t.navigateTo(getEnvUrl(`/fi/help`));
    },
  };

  const expectations = {
    async urlChangedToApiPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/api`, await getErrorMessage(t));
    },
    async urlChangedToContactPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/support/contact`, await getErrorMessage(t));
    },
    async urlChangedToControlPanelPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/control-panel`, await getErrorMessage(t));
    },
    async urlChangedToCreateEventPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/events/create`, await getErrorMessage(t));
    },
    async urlChangedToDocumentationPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/documentation`, await getErrorMessage(t));
    },
    async urlChangedToEventsPage() {
      await t.expect(getPathname()).eql(`/fi/events`, await getErrorMessage(t));
    },
    async urlChangedToEventSearchPage() {
      await t.expect(getPathname()).eql(`/fi/search`, await getErrorMessage(t));
    },
    async urlChangedToFaqPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/faq`, await getErrorMessage(t));
    },
    async urlChangedToFeaturesPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/features`, await getErrorMessage(t));
    },
    async urlChangedToImageRightsPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/image-rights`, await getErrorMessage(t));
    },
    async urlChangedToLandingPage() {
      await t.expect(getPathname()).eql(`/fi`, await getErrorMessage(t));
    },
    async urlChangedToPlatformPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/platform`, await getErrorMessage(t));
    },
    async urlChangedToSourceCodePage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/source-code`, await getErrorMessage(t));
    },
    async urlChangedToSupportPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/general`, await getErrorMessage(t));
    },
    async urlChangedToTechnologyGeneralPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/technology/general`, await getErrorMessage(t));
    },
    async urlChangedToTermsOfUsePage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/support/terms-of-use`, await getErrorMessage(t));
    },
  };

  return {
    actions,
    expectations,
  };
};
