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
      apiTab() {
        return withinSideNavigation().findByRole('link', {
          name: /rajapinta/i,
        });
      },
      contactTab() {
        return withinSideNavigation().findByRole('link', {
          name: /ota yhteyttä/i,
        });
      },
      controlPanelTab() {
        return withinSideNavigation().findByRole('link', {
          name: /hallintapaneeli/i,
        });
      },
      documentationTab() {
        return withinSideNavigation().findByRole('link', {
          name: /dokumentaatio/i,
        });
      },
      faqTab() {
        return withinSideNavigation().findByRole('link', {
          name: /ukk/i,
        });
      },
      featuresTab() {
        return withinSideNavigation().findByRole('link', {
          name: /palvelun ominaisuudet/i,
        });
      },
      imageRightsTab() {
        return withinSideNavigation().findByRole('link', {
          name: /kuvaoikeudet/i,
        });
      },
      instructionsGeneralTab() {
        return withinSideNavigation().findByRole('link', { name: /yleistä/i });
      },
      instructionsTab() {
        return withinSideNavigation().findByRole('link', { name: /ohjeet/i });
      },
      platformTab() {
        return withinSideNavigation().findByRole('link', { name: /alusta/i });
      },
      sourceCodeTab() {
        return withinSideNavigation().findByRole('link', {
          name: /lähdekoodi/i,
        });
      },
      supportTab() {
        return withinSideNavigation().findByRole('link', { name: /tuki/i });
      },
      technologyGeneralTab() {
        return withinSideNavigation().findByRole('link', {
          name: /yleistä/i,
        });
      },
      technologyTab() {
        return withinSideNavigation().findByRole('link', {
          name: /teknologia/i,
        });
      },
      termsOfUseTab() {
        return withinSideNavigation().findByRole('link', {
          name: /käyttöehdot/i,
        });
      },
    };

    const actions = {
      async clickApiTab() {
        return await t.click(selectors.apiTab());
      },
      async clickContactTab() {
        return await t.click(selectors.contactTab());
      },
      async clickControlPanelTab() {
        return await t.click(selectors.controlPanelTab());
      },
      async clickDocumentationTab() {
        return await t.click(selectors.documentationTab());
      },
      async clickFaqTab() {
        return await t.click(selectors.faqTab());
      },
      async clickFeaturesTab() {
        return await t.click(selectors.featuresTab());
      },
      async clickImageRightsTab() {
        return await t.click(selectors.imageRightsTab());
      },
      async clickInstructionsGeneralTab() {
        return await t.click(selectors.instructionsGeneralTab());
      },
      async clickInstructionsTab() {
        return await t.click(selectors.instructionsTab());
      },
      async clickPlatformTab() {
        return await t.click(selectors.platformTab());
      },
      async clickSourceCodeTab() {
        return await t.click(selectors.sourceCodeTab());
      },
      async clickSupportTab() {
        return await t.click(selectors.supportTab());
      },
      async clickTechnologyTab() {
        return await t.click(selectors.technologyTab());
      },
      async clickTechnologyGeneralTab() {
        return await t.click(selectors.technologyGeneralTab());
      },
      async clickTermsOfUseTab() {
        return await t.click(selectors.termsOfUseTab());
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
