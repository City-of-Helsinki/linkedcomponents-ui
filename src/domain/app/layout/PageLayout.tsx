import React from 'react';
import { Helmet } from 'react-helmet';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  const locale = useLocale();

  const path = window.location.pathname.replace(`/${locale}`, '');

  return (
    <div className={styles.pageLayout}>
      <Helmet>
        <html lang={locale} />

        {Object.values(SUPPORTED_LANGUAGES).map((language) => {
          const langCode = language.toLowerCase();
          return (
            <link
              key={langCode}
              rel="alternate"
              hrefLang={langCode}
              href={`/${langCode}` + path}
            />
          );
        })}
      </Helmet>

      <Header />
      <div className={styles.pageBody}>{children}</div>

      <Footer />
    </div>
  );
};

export default PageLayout;
