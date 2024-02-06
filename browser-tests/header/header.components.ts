/* eslint-disable no-undef */
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
  if (locale === SUPPORTED_LANGUAGES.EN) {
    return translationsEn;
  }
  return translationsFi;
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
      ownEventsTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.events,
        });
      },
      searchEventsTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.searchEvents,
        });
      },
      supportTab() {
        return withinHeader().findByRole('link', {
          name: getTranslations(currentLang).navigation.tabs.help,
        });
      },
    };

    const expectations = {
      async tabIsVisible(selector: SelectorPromise) {
        await t.expect(selector.exists).ok(await getErrorMessage(t));
      },
      async adminPageTabIsVisible() {
        await expectations.tabIsVisible(selectors.adminTab());
      },
      async ownEventsPageTabIsVisible() {
        await expectations.tabIsVisible(selectors.ownEventsTab());
      },
      async searchEventsPageTabIsVisible() {
        await expectations.tabIsVisible(selectors.searchEventsTab());
      },
      async supportPageTabIsVisible() {
        await expectations.tabIsVisible(selectors.supportTab());
      },
    };

    const actions = {
      async clickAdminPageTab() {
        await t.click(selectors.adminTab());
      },
      async clickOwnEventsPageTab() {
        await t.click(selectors.ownEventsTab());
      },
      async clickSearchEventsPageTab() {
        await t.click(selectors.searchEventsTab());
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
