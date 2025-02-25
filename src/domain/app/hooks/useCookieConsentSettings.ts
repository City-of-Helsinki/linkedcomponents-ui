import { CookieConsentReactProps } from 'hds-react';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import siteSettings from '../../app/cookieConsent/data/siteSettings.json';

const useCookieConsentSettings = () => {
  const locale = useLocale();

  const cookieConsentProps: CookieConsentReactProps = {
    onChange: (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    },
    siteSettings: siteSettings,
    options: { focusTargetSelector: `#${PAGE_HEADER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
