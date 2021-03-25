import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';
import { Helmet } from 'react-helmet';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import { useTheme } from '../theme/Theme';
import styles from './pageLayout.module.scss';
import ResetFocus from './ResetFocus';
import ScrollToTop from './ScrollToTop';

const RESET_IGNORED_PATHS = [
  { pathname: ROUTES.HELP, props: { exact: false } },
];

const PageLayout: React.FC = ({ children }) => {
  const { theme } = useTheme();
  const locale = useLocale();

  const path = window.location.pathname.replace(`/${locale}`, '');

  return (
    <>
      <ResetFocus ignoredPaths={RESET_IGNORED_PATHS} />
      <ScrollToTop />
      <div
        className={classNames(
          styles.pageLayout,
          css(theme.layout),
          css(theme.root)
        )}
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

        <Header />
        <div className={styles.pageBody}>{children}</div>

        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
