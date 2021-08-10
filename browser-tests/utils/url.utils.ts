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
    async urlChangedToEventsPage() {
      await t.expect(getPathname()).eql(`/fi/events`, await getErrorMessage(t));
    },
    async urlChangedToLandingPage() {
      await t.expect(getPathname()).eql(`/fi`, await getErrorMessage(t));
    },
    async urlChangedToSupportPage() {
      await t
        .expect(getPathname())
        .eql(`/fi/help/instructions/general`, await getErrorMessage(t));
    },
  };

  return {
    actions,
    expectations,
  };
};
