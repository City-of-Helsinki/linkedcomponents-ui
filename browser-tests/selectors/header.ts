import { screen } from '@testing-library/testcafe';

import translations from '../../src/domain/app/i18n/fi.json';

export const header = {
  languageSelector: screen.getByRole('button', {
    name: `${translations.navigation.languageSelectorAriaLabel} FI`,
  }),
  languageSelectorItemEn: screen.getByRole('option', { name: 'In English' }),
  languageSelectorItemFi: screen.getByRole('option', { name: 'Suomeksi' }),
  languageSelectorItemSv: screen.getByRole('option', { name: 'På svenska' }),
};
