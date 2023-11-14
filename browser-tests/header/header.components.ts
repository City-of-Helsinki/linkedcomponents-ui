/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../src/constants';
import translationsEn from '../../src/domain/app/i18n/en.json';
import translationsFi from '../../src/domain/app/i18n/fi.json';
import {
  getErrorMessage,
  screenContext,
  setDataToPrintOnFailure,
  withinContext,
} from '../utils/testcafe.utils';

const getTranslations = (locale: SUPPORTED_LANGUAGES) => {
  switch (locale) {
    case SUPPORTED_LANGUAGES.EN:
      return translationsEn;
    default:
      return translationsFi;
  }
};

export const findHeader = async (
  t: TestController,
  locale = DEFAULT_LANGUAGE
) => {
  setDataToPrintOnFailure(t, 'expectedLanguage', locale);
  let currentLang = locale;
  const within = withinContext(t);
  const screen = screenContext(t);

  await t
    .expect(screen.findByRole('banner').exists)
    .ok(await getErrorMessage(t));

  const withinHeader = () => {
    return within(screen.getByRole('banner'));
  };

  const languageSelector = () => {
    const selectors = {
      languageSelectorButton(lang: SUPPORTED_LANGUAGES) {
        return withinHeader().findByRole('button', {
          name: getTranslations(currentLang).navigation.languages[lang],
        });
      },
    };

    const actions = {
      async changeLanguage(lang: SUPPORTED_LANGUAGES) {
        const result = await t.click(selectors.languageSelectorButton(lang));

        currentLang = lang;
        setDataToPrintOnFailure(t, 'expectedLanguage', lang);
        return result;
      },
    };

    return { actions };
  };

  const headerTabs = () => {
    const selectors = {
      adminTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.admin,
        });
      },
      eventsTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.events,
        });
      },
      searchEventsTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.searchEvents,
        });
      },
      registrationsTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.registrations,
        });
      },
      supportTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.help,
        });
      },
    };

    const expectations = {
      async adminPageTabIsVisible() {
        await t
          .expect(selectors.adminTab().exists)
          .ok(await getErrorMessage(t));
      },
      async eventsPageTabIsVisible() {
        await t
          .expect(selectors.eventsTab().exists)
          .ok(await getErrorMessage(t));
      },
      async searchEventsPageTabIsVisible() {
        await t
          .expect(selectors.searchEventsTab().exists)
          .ok(await getErrorMessage(t));
      },
      async registrationsPageTabIsVisible() {
        await t
          .expect(selectors.registrationsTab().exists)
          .ok(await getErrorMessage(t));
      },
      async supportPageTabIsVisible() {
        await t
          .expect(selectors.supportTab().exists)
          .ok(await getErrorMessage(t));
      },
    };

    const actions = {
      async clickAdminPageTab() {
        await t.click(selectors.adminTab());
      },
      async clickEventsPageTab() {
        await t.click(selectors.eventsTab());
      },
      async clickSearchEventsPageTab() {
        await t.click(selectors.searchEventsTab());
      },
      async clickRegistrationsPageTab() {
        await t.click(selectors.registrationsTab());
      },
      async clickSupportPageTab() {
        await t.click(selectors.supportTab());
      },
    };

    return {
      expectations,
      actions,
    };
  };

  return {
    languageSelector,
    headerTabs,
  };
};
