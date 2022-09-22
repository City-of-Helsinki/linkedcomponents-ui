import { CookieModal } from 'hds-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';

type SupportedLanguage = 'en' | 'fi' | 'sv';

const translations = {
  expiration: {
    session: {
      en: 'Session',
      fi: 'Istunto',
      sv: 'Session',
    },
  },
  enrolmentForm: {
    description: {
      en: 'The cookie required to save the enrolment form data',
      fi: 'Osallistumislomakkeen tietojen säilymiseksi vaadittu eväste',
      sv: 'Cookien som krävs för att spara deltagande formulär data',
    },
    name: {
      en: 'Registration form cookie',
      fi: 'Osallistumislomakkeen eväste',
      sv: 'Cookie för deltagande formulär',
    },
  },
  eventForm: {
    description: {
      en: 'The cookie required to save the event form data',
      fi: 'Tapahtumalomakkeen tietojen säilymiseksi vaadittu eväste',
      sv: 'Cookien som krävs för att spara evenemang formulär data',
    },
    name: {
      en: 'Event form cookie',
      fi: 'Tapahtumalomakkeen eväste',
      sv: 'Cookie för evenemang formulär',
    },
  },
  registrationForm: {
    description: {
      en: 'The cookie required to save the registration form data',
      fi: 'Ilmoittautumislomakkeen tietojen säilymiseksi vaadittu eväste',
      sv: 'Cookien som krävs för att spara registrering formulär data',
    },
    name: {
      en: 'Registration form cookie',
      fi: 'Ilmoittautumislomakkeen eväste',
      sv: 'Cookie för registrering formulär',
    },
  },
};

const origin = window.location.origin;

const CookieConsent = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [language, setLanguage] = useState<SupportedLanguage>(locale);

  const onLanguageChange = async (newLang: string) =>
    setLanguage(newLang as SupportedLanguage);

  useEffect(() => setLanguage(locale), [locale]);

  return (
    <CookieModal
      contentSource={{
        siteName: t('appName'),
        currentLanguage: language,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'login',
              cookies: [{ commonCookie: 'tunnistamo' }],
            },
            {
              commonGroup: 'userInputs',
              cookies: [
                {
                  id: 'eventForm',
                  hostName: origin,
                  name: translations.eventForm.name[language],
                  description: translations.eventForm.description[language],
                  expiration: translations.expiration.session[language],
                },
                {
                  id: 'registrationForm',
                  hostName: origin,
                  name: translations.registrationForm.name[language],
                  description:
                    translations.registrationForm.description[language],
                  expiration: translations.expiration.session[language],
                },
                {
                  id: 'enrolmentForm',
                  hostName: origin,
                  name: translations.enrolmentForm.name[language],
                  description: translations.enrolmentForm.description[language],
                  expiration: translations.expiration.session[language],
                },
              ],
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              commonGroup: 'statistics',
              cookies: [{ commonCookie: 'matomo' }],
            },
          ],
        },
        language: { onLanguageChange },
        onAllConsentsGiven: (consents) => {
          if (consents.matomo) {
            //  start tracking
            window._paq.push(['setConsentGiven']);
            window._paq.push(['setCookieConsentGiven']);
          }
        },
        onConsentsParsed: (consents) => {
          if (consents.matomo === undefined) {
            // tell matomo to wait for consent:
            window._paq.push(['requireConsent']);
            window._paq.push(['requireCookieConsent']);
          } else if (consents.matomo === false) {
            // tell matomo to forget conset
            window._paq.push(['forgetConsentGiven']);
          }
        },
        focusTargetSelector: `#${PAGE_HEADER_ID}`,
      }}
    />
  );
};

export default CookieConsent;
