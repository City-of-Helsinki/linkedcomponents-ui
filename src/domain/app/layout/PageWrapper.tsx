import { useMatomo } from '@datapunt/matomo-tracker-react';
import classNames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
import { useCookieConsent } from '../cookieConsent/CookieConsentContext';
import styles from './pageWrapper.module.scss';

export interface PageWrapperProps {
  backgroundColor?: 'white' | 'gray' | 'coatOfArms';
  className?: string;
  description?: string;
  keywords?: string[];
  noFooter?: boolean;
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  backgroundColor = 'white',
  children,
  className,
  description = 'appDescription',
  keywords = [],
  noFooter = false,
  title = 'appName',
}) => {
  const { consent } = useCookieConsent();
  const { t } = useTranslation();
  const location = useLocation();
  const { trackPageView } = useMatomo();

  const getTranslatedKeywords = () => {
    return [
      ...keywords,
      'keywords.linked',
      'keywords.events',
      'keywords.event',
      'keywords.management',
      'keywords.api',
      'keywords.admin',
      'keywords.helsinki',
      'keywords.finland',
    ]
      .map((k) => t(k))
      .join(', ');
  };

  const translatedTitle =
    title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');
  const translatedDescription = t(description);
  const translatedKeywords = getTranslatedKeywords();

  const openGraphProperties: { [key: string]: string } = {
    // TODO: Add image to page meta data
    // image: image,
    description: translatedDescription,
    title: translatedTitle,
  };

  const twitterProperties: { [key: string]: string } = {
    // TODO: Add image to page meta data
    // image: image,
    description: translatedDescription,
    title: translatedTitle,
  };

  // Track page view
  React.useEffect(() => {
    if (consent.tracking) {
      trackPageView({
        documentTitle: translatedTitle,
        href: window.location.href,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent.tracking, location.pathname, location.search]);

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
        <meta name="description" content={translatedDescription} />
        <meta name="keywords" content={translatedKeywords} />

        {/* Open Graph data */}
        <meta property={`og:type`} content="website" />
        {Object.entries(openGraphProperties).map(([property, value]) => (
          <meta key={property} property={`og:${property}`} content={value} />
        ))}

        {/* Twitter card */}
        <meta name="twitter:card" content="summary" />
        {Object.entries(twitterProperties).map(([property, value]) => (
          <meta
            key={property}
            property={`twitter:${property}`}
            content={value}
          />
        ))}
      </Helmet>
      {children}
    </div>
  );
};

export default PageWrapper;
