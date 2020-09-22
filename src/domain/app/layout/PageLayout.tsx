import classNames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const path = window.location.pathname.replace(`/${locale}`, '');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={classNames(styles.pageLayout, { [styles.menuOpen]: menuOpen })}
    >
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

      <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
      <div aria-hidden={menuOpen} className={styles.pageBody}>
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default PageLayout;
