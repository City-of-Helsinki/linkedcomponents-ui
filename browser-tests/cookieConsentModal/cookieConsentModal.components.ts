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
    .expect(screen.findByRole('dialog').exists)
    .ok(await getErrorMessage(t));

  const withinCookieConsentModal = () => {
    return within(screen.getByRole('dialog'));
  };

  const selectors = {
    acceptCheckbox() {
      return withinCookieConsentModal().findByRole('checkbox', {
        name: /olen lukenut ja hyväksyn palvelun käyttöehdot/i,
      });
    },
    acceptAllButton() {
      return withinCookieConsentModal().findByRole('button', {
        name: /kaikki/i,
      });
    },
    heading() {
      return withinCookieConsentModal().findByRole('heading', {
        name: /linked events käyttöehdot ja evästeet/i,
      });
    },
  };

  const actions = {
    async clickAcceptCheckbox() {
      const result = await t.click(selectors.acceptCheckbox());
      return result;
    },
    async clickAcceptAllButton() {
      const result = await t.click(selectors.acceptAllButton());
      return result;
    },
    async acceptAllCookies() {
      await expectations.headingIsVisible();
      await actions.clickAcceptCheckbox();
      await expectations.acceptCheckboxIsChecked();
      await expectations.acceptAllButtonIsEnabled();
      await actions.clickAcceptAllButton();
    },
  };

  const expectations = {
    async acceptCheckboxIsChecked() {
      await t
        .expect(selectors.acceptCheckbox().checked)
        .eql(true, await getErrorMessage(t));
    },
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
