import { useMatomo } from '@datapunt/matomo-tracker-react';
import classNames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import useDeepCompareEffect from 'use-deep-compare-effect';

import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
import { useCookieConsent } from '../cookieConsent/CookieConsentContext';
import styles from './pageWrapper.module.scss';

export interface PageWrapperProps {
  backgroundColor?: 'white' | 'gray' | 'coatOfArms';
  className?: string;
  noFooter?: boolean;
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  backgroundColor = 'white',
  children,
  className,
  noFooter = false,
  title = 'appName',
}) => {
  const { consent } = useCookieConsent();
  const { t } = useTranslation();
  const location = useLocation();
  const { trackPageView } = useMatomo();

  const translatedTitle =
    title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');

  const openGraphProperties: { [key: string]: string } = {
    // TODO: Add image to page meta data
    // image: image,
    title: translatedTitle,
  };

  // Track page view
  useDeepCompareEffect(() => {
    if (consent.tracking) {
      trackPageView({
        documentTitle: translatedTitle,
        href: window.location.href,
      });
    }
  }, [{ pathname: location.pathname, search: location.search }]);

  return (
    <div
      className={classNames(
        styles.pageWrapper,
        [styles[`backgroundColor${upperCaseFirstLetter(backgroundColor)}`]],
        { [styles.noFooter]: noFooter },
        className
      )}
    >
      <Helmet>
        <title>{translatedTitle}</title>

        <meta name="twitter:card" content="summary" />
        {Object.entries(openGraphProperties).map(([property, value]) => (
          <meta key={property} property={`og:${property}`} content={value} />
        ))}
      </Helmet>
      {children}
    </div>
  );
};

export default PageWrapper;
