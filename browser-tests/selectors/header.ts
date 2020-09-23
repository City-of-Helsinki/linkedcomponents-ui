import { screen } from '@testing-library/testcafe';

import translations from '../../src/domain/app/i18n/fi.json';

export const header = {
  languageSelector: screen.getByRole('button', {
    name: `${translations.navigation.languageSelectorAriaLabel} FI`,
  }),
  languageSelectorItemEn: screen.getByRole('option', {
    name: translations.navigation.languages.en,
  }),
  languageSelectorItemFi: screen.getByRole('option', {
    name: translations.navigation.languages.fi,
  }),
  languageSelectorItemSv: screen.getByRole('option', {
    name: translations.navigation.languages.sv,
  }),
};
