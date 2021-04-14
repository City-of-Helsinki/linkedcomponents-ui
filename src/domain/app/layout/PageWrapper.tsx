import classNames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
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
  const { t } = useTranslation();

  const translatedTitle =
    title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');

  const openGraphProperties: { [key: string]: string } = {
    // TODO: Add image to page meta data
    // image: image,
    title: translatedTitle,
  };

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
