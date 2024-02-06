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
      accessibilityLink() {
        return withinFooter().findByRole('link', {
          name: /saavutettavuusseloste/i,
        });
      },
      adminLink() {
        return withinFooter().findByRole('link', { name: /hallinta/i });
      },
      apiLink() {
        return withinFooter().findByRole('link', { name: /rajapinta/i });
      },
      askPermissionLink() {
        return withinFooter().findByRole('link', {
          name: /pyydä käyttöoikeutta/i,
        });
      },
      contactLink() {
        return withinFooter().findByRole('link', { name: /ota yhteyttä/i });
      },
      controlPanelLink() {
        return withinFooter().findByRole('link', { name: /hallintapaneeli/i });
      },
      createEventLink() {
        return withinFooter().findByRole('link', { name: /uusi tapahtuma/i });
      },
      documentationLink() {
        return withinFooter().findByRole('link', { name: /dokumentaatio/i });
      },
      faqLink() {
        return withinFooter().findByRole('link', { name: /UKK/ });
      },
      featuresLink() {
        return withinFooter().findByRole('link', {
          name: /Palvelun ominaisuudet/i,
        });
      },
      imageRightsLink() {
        return withinFooter().findByRole('link', { name: /kuvaoikeudet/i });
      },
      instructionsLink() {
        return withinFooter().findByRole('link', { name: /ohjeet/i });
      },
      ownEventsLink() {
        return withinFooter().findByRole('link', { name: /omat tapahtumat/i });
      },
      platformLink() {
        return withinFooter().findByRole('link', { name: /alusta/i });
      },
      registrationInstructionsLink() {
        return withinFooter().findByRole('link', {
          name: /Linked Registration -ohje/i,
        });
      },
      registrationsLink() {
        return withinFooter().findByRole('link', { name: /ilmoittautuminen/i });
      },
      searchEventsLink() {
        return withinFooter().findByRole('link', { name: /etsi tapahtumia/i });
      },
      sourceCodeLink() {
        return withinFooter().findByRole('link', { name: /lähdekoodi/i });
      },
      supportLink() {
        return withinFooter().findByRole('link', { name: /tuki/i });
      },
      technologyLink() {
        return withinFooter().findByRole('link', { name: /teknologia/i });
      },
      termsOfUseLink() {
        return withinFooter().findByRole('link', { name: /käyttöehdot/i });
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
      async eventSearchPageLinkIsVisible() {
        await t
          .expect(selectors.searchEventsLink().exists)
          .ok(await getErrorMessage(t));
      },
      async ownEventsPageLinkIsVisible() {
        await t
          .expect(selectors.ownEventsLink().exists)
          .ok(await getErrorMessage(t));
      },
      async registrationsPageLinkIsVisible() {
        await t
          .expect(selectors.registrationsLink().exists)
          .ok(await getErrorMessage(t));
      },
      async supportPageLinkIsVisible() {
        await t
          .expect(selectors.supportLink().exists)
          .ok(await getErrorMessage(t));
      },
    };

    const actions = {
      async clickAccessibilityLink() {
        await t.click(selectors.accessibilityLink());
      },
      async clickAdminPageLink() {
        await t.click(selectors.adminLink());
      },
      async clickApiPageLink() {
        await t.click(selectors.apiLink());
      },
      async clickAskPermissionLink() {
        await t.click(selectors.askPermissionLink());
      },
      async clickContactPageLink() {
        await t.click(selectors.contactLink());
      },
      async clickControlPanelPageLink() {
        await t.click(selectors.controlPanelLink());
      },
      async clickCreateEventPageLink() {
        await t.click(selectors.createEventLink());
      },
      async clickDocumentationPageLink() {
        await t.click(selectors.documentationLink());
      },
      async clickFaqPageLink() {
        await t.click(selectors.faqLink());
      },
      async clickFeaturesLink() {
        await t.click(selectors.featuresLink());
      },
      async clickImageRightsPageLink() {
        await t.click(selectors.imageRightsLink());
      },
      async clickInstructionsPageLink() {
        await t.click(selectors.instructionsLink());
      },
      async clickOwnEventsPageLink() {
        await t.click(selectors.ownEventsLink());
      },
      async clickPlatformPageLink() {
        await t.click(selectors.platformLink());
      },
      async clickRegistrationInstructionsPageLink() {
        await t.click(selectors.registrationInstructionsLink());
      },
      async clickRegistrationsPageLink() {
        await t.click(selectors.registrationsLink());
      },
      async clickSearchEventsPageLink() {
        await t.click(selectors.searchEventsLink());
      },
      async clickSourceCodePageLink() {
        await t.click(selectors.sourceCodeLink());
      },
      async clickSupportPageLink() {
        await t.click(selectors.supportLink());
      },
      async clickTechnologyPageLink() {
        await t.click(selectors.technologyLink());
      },
      async clickTermsOfUsePageLink() {
        await t.click(selectors.termsOfUseLink());
      },
    };

    return {
      expectations,
      actions,
    };
  };

  return { footerLinks };
};
