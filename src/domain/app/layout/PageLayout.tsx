import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';
import { Helmet } from 'react-helmet';
import { matchPath, RouteProps, useLocation } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import { useTheme } from '../theme/Theme';
import styles from './pageLayout.module.scss';
import ResetFocus from './ResetFocus';
import ScrollToTop from './ScrollToTop';

interface IgnorePathProps {
  pathname: string;
  props?: RouteProps;
}

const RESET_IGNORED_PATHS = [
  { pathname: ROUTES.HELP, props: { exact: false } },
];

const NO_KORO_PATHS = [
  { pathname: ROUTES.HELP, props: { exact: false } },
  { pathname: ROUTES.EDIT_EVENT, props: { exact: true } },
];

const PageLayout: React.FC = ({ children }) => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const locale = useLocale();

  const path = pathname.replace(`/${locale}`, '');
  const host = window.location.origin;

  const isMatch = (paths: IgnorePathProps[]) =>
    paths.some((path) =>
      matchPath(pathname, {
        path: `/${locale}${path.pathname}`,
        exact: path.props?.exact ?? true,
        strict: path.props?.strict ?? true,
      })
    );

  const noKoro = isMatch(NO_KORO_PATHS);
  const canonicalUrl = host + pathname;

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

          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="twitter:url" content={canonicalUrl} />

          {Object.values(SUPPORTED_LANGUAGES).map((language) => {
            const langCode = language.toLowerCase();
            return (
              <link
                key={langCode}
                rel="alternate"
                hrefLang={langCode}
                href={`${host}/${langCode}${path}`}
              />
            );
          })}
        </Helmet>

        <Header />
        <div
          className={classNames(styles.pageBody, { [styles.noKoro]: noKoro })}
        >
          {children}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
