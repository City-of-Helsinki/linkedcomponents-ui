import { css } from '@emotion/css';
import classNames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { matchPath, PathPattern, useLocation } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useCookieConsent } from '../cookieConsent/CookieConsentContext';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import { useTheme } from '../theme/Theme';
import styles from './pageLayout.module.scss';
import ResetFocus from './ResetFocus';
import ScrollToTop from './ScrollToTop';

const RESET_IGNORED_PATHS: PathPattern[] = [{ end: false, path: ROUTES.HELP }];

const NO_KORO_PATHS: PathPattern[] = [
  { path: ROUTES.HELP, end: false },
  { path: ROUTES.EDIT_EVENT },
  { path: ROUTES.EDIT_REGISTRATION },
  { path: ROUTES.EDIT_REGISTRATION_ENROLMENT },
  { path: ROUTES.REGISTRATION_ENROLMENTS },
];

const PageLayout: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { isConsentModalOpen } = useCookieConsent();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const locale = useLocale();

  const path = pathname.replace(`/${locale}`, '');
  const host = window.location.origin;

  const isMatch = (paths: PathPattern[]) =>
    paths.some((path) =>
      matchPath(
        { path: `/${locale}${path.path}`, end: path.end ?? true },
        pathname
      )
    );

  const noKoro = isMatch(NO_KORO_PATHS);
  const canonicalUrl = host + pathname;

  return (
    <>
      <ResetFocus
        disabled={isConsentModalOpen}
        ignoredPaths={RESET_IGNORED_PATHS}
      />
      <ScrollToTop />
      <div
        className={classNames(
          styles.pageLayout,
          css(theme.layout),
          css(theme.root)
        )}
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
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
