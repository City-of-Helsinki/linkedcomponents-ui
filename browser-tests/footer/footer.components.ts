/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import {
  getErrorMessage,
  screenContext,
  withinContext,
} from '../utils/testcafe.utils';

export const findFooter = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  await t
    .expect(screen.findByRole('contentinfo').exists)
    .ok(await getErrorMessage(t));

  const withinFooter = () => {
    return within(screen.getByRole('contentinfo'));
  };

  const footerLinks = () => {
    const selectors = {
      adminLink() {
        return withinFooter().findByRole('link', { name: /hallinta/i });
      },
      contactLink() {
        return withinFooter().findByRole('link', { name: /ota yhteyttä/i });
      },
      eventsLink() {
        return withinFooter().findByRole('link', { name: /omat tapahtumat/i });
      },
      eventSearchLink() {
        return withinFooter().findByRole('link', { name: /etsi tapahtumia/i });
      },
      registrationsLink() {
        return withinFooter().findByRole('link', { name: /ilmoittautuminen/i });
      },
      instructionsLink() {
        return withinFooter().findByRole('link', { name: /ohjeet/i });
      },
    };

    const expectations = {
      async adminIsVisible() {
        await t
          .expect(selectors.contactLink().exists)
          .ok(await getErrorMessage(t));
      },
      async contactLinkIsVisible() {
        await t
          .expect(selectors.contactLink().exists)
          .ok(await getErrorMessage(t));
      },
      async eventsPageLinkIsVisible() {
        await t
          .expect(selectors.eventsLink().exists)
          .ok(await getErrorMessage(t));
      },
      async eventSearchPageLinkIsVisible() {
        await t
          .expect(selectors.eventSearchLink().exists)
          .ok(await getErrorMessage(t));
      },
      async registrationsPageLinkIsVisible() {
        await t
          .expect(selectors.registrationsLink().exists)
          .ok(await getErrorMessage(t));
      },
      async instructionsPageLinkIsVisible() {
        await t
          .expect(selectors.instructionsLink().exists)
          .ok(await getErrorMessage(t));
      },
    };

    const actions = {
      async clickAdminPageLink() {
        await t.click(selectors.adminLink());
      },
      async clickContactPageLink() {
        await t.click(selectors.contactLink());
      },
      async clickEventsPageLink() {
        await t.click(selectors.eventsLink());
      },
      async clickEventSearchPageLink() {
        await t.click(selectors.eventSearchLink());
      },
      async clickRegistrationsPageLink() {
        await t.click(selectors.registrationsLink());
      },
      async clickInstructionsPageLink() {
        await t.click(selectors.instructionsLink());
      },
    };

    return {
      expectations,
      actions,
    };
  };

  return { footerLinks };
};
