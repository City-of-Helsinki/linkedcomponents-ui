import { CookieModal } from 'hds-react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';

type SupportedLanguage = 'en' | 'fi' | 'sv';

const origin = window.location.origin;

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [language, setLanguage] = useState(locale);

  const [showCookieConsentModal, setShowCookieConsentModal] = useState(true);

  const { languageOptions, changeLanguage } = useSelectLanguage();

  const onLanguageChange = async (lang: string) => {
    const langOption = languageOptions.find(
      (l) => l.value === (lang as SupportedLanguage)
    );

    if (langOption) {
      changeLanguage(langOption)();
    }
    setLanguage(lang as SupportedLanguage);
  };

  if (!showCookieConsentModal) return null;

  return (
    <CookieModal
      contentSource={{
        siteName: t('common.cookieConsent.siteName') as string,
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
                  name: t('common.cookieConsent.eventForm.name') as string,
                  description: t(
                    'common.cookieConsent.eventForm.description'
                  ) as string,
                  expiration: t(
                    'common.cookieConsent.expiration.session'
                  ) as string,
                },
                {
                  id: 'registrationForm',
                  hostName: origin,
                  name: t(
                    'common.cookieConsent.registrationForm.name'
                  ) as string,
                  description: t(
                    'common.cookieConsent.registrationForm.description'
                  ) as string,
                  expiration: t(
                    'common.cookieConsent.expiration.session'
                  ) as string,
                },
                {
                  id: 'enrolmentForm',
                  hostName: origin,
                  name: t('common.cookieConsent.enrolmentForm.name') as string,
                  description: t(
                    'common.cookieConsent.enrolmentForm.description'
                  ) as string,
                  expiration: t(
                    'common.cookieConsent.expiration.session'
                  ) as string,
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
          setShowCookieConsentModal(false);

          if (consents.matomo) {
            //  start tracking
            window._paq.push(['setConsentGiven']);
            window._paq.push(['setCookieConsentGiven']);
          }
        },
        onConsentsParsed: (consents) => {
          /* istanbul ignore next */
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
