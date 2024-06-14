import { CookieModal } from 'hds-react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import getValue from '../../../utils/getValue';

type SupportedLanguage = 'en' | 'fi' | 'sv';

const hostname = window.location.hostname;

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [language, setLanguage] = useState(locale);

  const { languageOptions, changeLanguage } = useSelectLanguage();

  const onLanguageChange = async (lang: string) => {
    const langOption = languageOptions.find(
      (l) => l.value === (lang as SupportedLanguage)
    );

    /* istanbul ignore else */
    if (langOption) {
      changeLanguage(langOption.value);
    }
    setLanguage(lang as SupportedLanguage);
  };

  return (
    <CookieModal
      contentSource={{
        siteName: t('common.cookieConsent.siteName'),
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
                  hostName: hostname,
                  name: t('common.cookieConsent.eventForm.name'),
                  description: t('common.cookieConsent.eventForm.description'),
                  expiration: t('common.cookieConsent.expiration.session'),
                },
                {
                  id: 'registrationForm',
                  hostName: hostname,
                  name: getValue(
                    t('common.cookieConsent.registrationForm.name'),
                    ''
                  ),
                  description: getValue(
                    t('common.cookieConsent.registrationForm.description'),
                    ''
                  ),
                  expiration: getValue(
                    t('common.cookieConsent.expiration.session'),
                    ''
                  ),
                },
                {
                  id: 'signupForm',
                  hostName: hostname,
                  name: t('common.cookieConsent.signupForm.name'),
                  description: t('common.cookieConsent.signupForm.description'),
                  expiration: t('common.cookieConsent.expiration.session'),
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
