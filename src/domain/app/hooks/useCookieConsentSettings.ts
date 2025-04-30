import { CookieConsentReactProps } from 'hds-react';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import siteSettings from './data/siteSettings.json';

const useCookieConsentSettings = () => {
  const locale = useLocale();

  const cookieConsentProps: CookieConsentReactProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange: () => {},
    siteSettings: siteSettings,
    options: { focusTargetSelector: `#${PAGE_HEADER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
