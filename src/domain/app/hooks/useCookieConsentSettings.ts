import { CookieConsentReactProps } from 'hds-react';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import siteSettings from '../../app/cookieConsent/data/siteSettings.json';

const hostname = window.location.hostname;

const useCookieConsentSettings = () => {
  const locale = useLocale();

  const { requiredGroups } = siteSettings;

  const requiredGroupsTransform = requiredGroups.map((group) => {
    const cookies = group.cookies.map((cookie) => {
      if (!cookie.host) {
        return {
          ...cookie,
          host: hostname,
        };
      }

      return cookie;
    });

    return {
      ...group,
      cookies,
    };
  });

  const cookieConsentProps: CookieConsentReactProps = {
    onChange: (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    },
    siteSettings: {
      ...siteSettings,
      requiredGroups: requiredGroupsTransform,
    },
    options: { focusTargetSelector: `#${PAGE_HEADER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
