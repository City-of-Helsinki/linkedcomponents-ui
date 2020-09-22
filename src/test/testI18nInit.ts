import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fi from '../domain/app/i18n/fi.json';

i18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'fi',
  resources: {
    fi: {
      translation: fi,
    },
  },
});

export default i18n;
