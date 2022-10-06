/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import {
  getErrorMessage,
  screenContext,
  withinContext,
} from '../utils/testcafe.utils';

export const findCookieConsentModal = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  await t
    .expect(screen.findByTestId('cookie-consent').exists)
    .ok(await getErrorMessage(t));

  const withinCookieConsentModal = () => {
    return within(screen.findByTestId('cookie-consent'));
  };

  const selectors = {
    acceptAllButton() {
      return withinCookieConsentModal().findByRole('button', {
        name: /Hyväksy kaikki evästeet/i,
      });
    },
    heading() {
      return withinCookieConsentModal().findByRole('heading', {
        name: /Linked Events käyttää evästeitä/i,
      });
    },
  };

  const actions = {
    async clickAcceptAllButton() {
      const result = await t.click(selectors.acceptAllButton());
      return result;
    },
    async acceptAllCookies() {
      await expectations.headingIsVisible();
      await expectations.acceptAllButtonIsEnabled();
      await actions.clickAcceptAllButton();

      await t.expect(screen.findByTestId('cookie-consent').exists).notOk();
    },
  };

  const expectations = {
    async acceptAllButtonIsEnabled() {
      await t
        .expect(selectors.acceptAllButton().hasAttribute('disabled'))
        .notOk(await getErrorMessage(t));
    },
    async headingIsVisible() {
      await t.expect(selectors.heading().exists).ok(await getErrorMessage(t));
    },
  };

  return {
    actions,
    expectations,
  };
};
