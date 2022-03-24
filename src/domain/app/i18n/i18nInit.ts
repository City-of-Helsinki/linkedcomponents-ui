import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: [
        'path',
        'querystring',
        'cookie',
        'localStorage',
        'navigator',
        'htmlTag',
        'subdomain',
      ],
    },
    fallbackLng: 'fi',
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: [
      SUPPORTED_LANGUAGES.EN,
      SUPPORTED_LANGUAGES.FI,
      // TODO: Add Swedish to supported languages when UI texts has been translated
      // SUPPORTED_LANGUAGES.SV,
    ],
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      sv: { translation: sv },
    },
  });

export default i18n;
