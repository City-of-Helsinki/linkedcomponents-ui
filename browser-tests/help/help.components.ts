/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import {
  getErrorMessage,
  screenContext,
  withinContext,
} from '../utils/testcafe.utils';

export const findHelpPages = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  await t
    .expect(screen.findByRole('list', { name: /siirry ohjesivulle/i }).exists)
    .ok(await getErrorMessage(t));

  const withinSideNavigation = () => {
    return within(screen.getByRole('list', { name: /siirry ohjesivulle/i }));
  };

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinHelpPage = () => {
    return within(screen.getByRole('main'));
  };

  const sideNavigation = () => {
    const selectors = {
      apiLink() {
        return withinSideNavigation().findByRole('link', {
          name: /rajapinta/i,
        });
      },
      askPermissionLink() {
        return withinSideNavigation().findByRole('link', {
          name: /pyydä käyttöoikeutta/i,
        });
      },
      contactLink() {
        return withinSideNavigation().findByRole('link', {
          name: /ota yhteyttä/i,
        });
      },
      controlPanelLink() {
        return withinSideNavigation().findByRole('link', {
          name: /hallintapaneeli/i,
        });
      },
      documentationLink() {
        return withinSideNavigation().findByRole('link', {
          name: /dokumentaatio/i,
        });
      },
      faqLink() {
        return withinSideNavigation().findByRole('link', {
          name: /ukk/i,
        });
      },
      featuresLink() {
        return withinSideNavigation().findByRole('link', {
          name: /palvelun ominaisuudet/i,
        });
      },
      imageRightsLink() {
        return withinSideNavigation().findByRole('link', {
          name: /kuvaoikeudet/i,
        });
      },
      instructionsButton() {
        return withinSideNavigation().findByRole('button', { name: /ohjeet/i });
      },
      instructionsGeneralLink() {
        return withinSideNavigation().findByRole('link', { name: /yleistä/i });
      },
      platformLink() {
        return withinSideNavigation().findByRole('link', { name: /alusta/i });
      },
      sourceCodeLink() {
        return withinSideNavigation().findByRole('link', {
          name: /lähdekoodi/i,
        });
      },
      supportButton() {
        return withinSideNavigation().findByRole('button', { name: /tuki/i });
      },
      technologyGeneralLink() {
        return withinSideNavigation().findByRole('link', {
          name: /yleistä/i,
        });
      },
      technologyButton() {
        return withinSideNavigation().findByRole('button', {
          name: /teknologia/i,
        });
      },
      termsOfUseLink() {
        return withinSideNavigation().findByRole('link', {
          name: /käyttöehdot/i,
        });
      },
    };

    const actions = {
      async clickApiLink() {
        return await t.click(selectors.apiLink());
      },
      async clickAskPermissionLink() {
        return await t.click(selectors.askPermissionLink());
      },
      async clickContactLink() {
        return await t.click(selectors.contactLink());
      },
      async clickControlPanelLink() {
        return await t.click(selectors.controlPanelLink());
      },
      async clickDocumentationLink() {
        return await t.click(selectors.documentationLink());
      },
      async clickFaqLink() {
        return await t.click(selectors.faqLink());
      },
      async clickFeaturesLink() {
        return await t.click(selectors.featuresLink());
      },
      async clickImageRightsLink() {
        return await t.click(selectors.imageRightsLink());
      },
      async clickInstructionsButton() {
        return await t.click(selectors.instructionsButton());
      },
      async clickInstructionsGeneralLink() {
        return await t.click(selectors.instructionsGeneralLink());
      },
      async clickPlatformLink() {
        return await t.click(selectors.platformLink());
      },
      async clickSourceCodeLink() {
        return await t.click(selectors.sourceCodeLink());
      },
      async clickSupportButton() {
        return await t.click(selectors.supportButton());
      },
      async clickTechnologyButton() {
        return await t.click(selectors.technologyButton());
      },
      async clickTechnologyGeneralLink() {
        return await t.click(selectors.technologyGeneralLink());
      },
      async clickTermsOfUseLink() {
        return await t.click(selectors.termsOfUseLink());
      },
    };

    return {
      actions,
    };
  };

  const helpPageTitles = () => {
    const selectors = {
      apiTitle() {
        return withinHelpPage().findByRole('heading', { name: /rajapinta/i });
      },
      askPermissionTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /pyydä käyttöoikeutta/i,
        });
      },
      contactTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /ota yhteyttä/i,
        });
      },
      controlPanelTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /hallintapaneeli/i,
        });
      },
      documentationTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /dokumentaatio/i,
        });
      },
      faqTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /usein kysytyt kysymykset/i,
        });
      },
      featuresTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /palvelun ominaisuudet/i,
        });
      },
      imageRightsTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /kuvaoikeudet/i,
        });
      },
      instructionsGeneralTitle() {
        return withinHelpPage().findByRole('heading', {
          name: /yleistä/i,
        });
      },
      platformTitle() {
        return withinHelpPage().findByRole('heading', { name: /alusta/i });
      },
      sourceCodeTitle() {
        return withinHelpPage().findByRole('heading', { name: /lähdekoodi/i });
      },
      technologyGeneralTitle() {
        return withinHelpPage().findByRole('heading', { name: /yleistä/i });
      },
      termsOfUseTitle() {
        return withinHelpPage().findByRole('heading', { name: /käyttöehdot/i });
      },
    };

    const expectations = {
      async apiTitleIsVisible() {
        await t
          .expect(selectors.apiTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async askPermissionTitleIsVisible() {
        await t
          .expect(selectors.askPermissionTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async contactTitleIsVisible() {
        await t
          .expect(selectors.contactTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async controlPanelTitleIsVisible() {
        await t
          .expect(selectors.controlPanelTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async documenationTitleIsVisible({ timeout } = { timeout: 10000 }) {
        await t
          .expect(selectors.documentationTitle().exists)
          .ok(await getErrorMessage(t), { timeout });
      },
      async faqTitleIsVisible() {
        await t
          .expect(selectors.faqTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async featuresTitleIsVisible() {
        await t
          .expect(selectors.featuresTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async imageRightsTitleIsVisible() {
        await t
          .expect(selectors.imageRightsTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async instructionsGeneralTitleIsVisible() {
        await t
          .expect(selectors.instructionsGeneralTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async platformTitleIsVisible() {
        await t
          .expect(selectors.platformTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async sourceCodeTitleIsVisible() {
        await t
          .expect(selectors.sourceCodeTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async technologyGeneralTitleIsVisible() {
        await t
          .expect(selectors.technologyGeneralTitle().exists)
          .ok(await getErrorMessage(t));
      },
      async termsOfUseTitleIsVisible() {
        await t
          .expect(selectors.termsOfUseTitle().exists)
          .ok(await getErrorMessage(t));
      },
    };

    return {
      expectations,
    };
  };

  return { helpPageTitles, sideNavigation };
};
