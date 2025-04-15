import { CookieConsentChangeEvent, CookieConsentReactProps } from 'hds-react';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import siteSettings from './data/siteSettings.json';

export enum COOKIE_CONSENT_GROUP {
  Tunnistamo = 'tunnistamo',
  UserInputs = 'userInputs',
  Shared = 'shared',
  Statistics = 'statistics',
}

const useCookieConsentSettings = () => {
  const locale = useLocale();

  const cookieConsentProps: CookieConsentReactProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange: (changeEvent: CookieConsentChangeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent =
        acceptedGroups.indexOf(COOKIE_CONSENT_GROUP.Statistics) > -1;

      if (hasStatisticsConsent) {
        //  start tracking
        window._paq.push(['setConsentGiven']);
        window._paq.push(['setCookieConsentGiven']);
      } else {
        // tell matomo to forget conset
        window._paq.push(['forgetConsentGiven']);
      }
    },
    siteSettings: siteSettings,
    options: { focusTargetSelector: `#${PAGE_HEADER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
