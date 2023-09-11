import { ClassNames } from '@emotion/react';
import React from 'react';
import { Helmet } from 'react-helmet';
import { matchPath, PathPattern, useLocation } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import Footer from '../../footer/Footer';
import Header from '../../header/Header';
import { useTheme } from '../../theme/Theme';
import MaintenanceNotification from '../maintenanceNotification/MaintenanceNotification';
import ResetFocus from '../resetFocus/ResetFocus';
import ScrollToTop from '../scrollToTop/ScrollToTop';
import styles from './pageLayout.module.scss';

const RESET_IGNORED_PATHS: PathPattern[] = [{ end: false, path: ROUTES.HELP }];

const NO_KORO_PATHS: PathPattern[] = [
  { path: ROUTES.HELP, end: false },
  { path: ROUTES.EDIT_EVENT },
  { path: ROUTES.EDIT_REGISTRATION },
  { path: ROUTES.EDIT_SIGNUP_GROUP },
  { path: ROUTES.REGISTRATION_ENROLMENTS },
];

const PageLayout: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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

  const MAINTENANCE_SHOW_NOTIFICATION =
    process.env.REACT_APP_MAINTENANCE_SHOW_NOTIFICATION === 'true';

  return (
    <ClassNames>
      {({ css, cx }) => (
        <>
          <ResetFocus ignoredPaths={RESET_IGNORED_PATHS} />
          <ScrollToTop />
          <div
            className={cx(
              styles.pageLayout,
              css(theme.layout),
              css(theme.root),
              MAINTENANCE_SHOW_NOTIFICATION && styles.hasMaintenanceNotification
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
            {MAINTENANCE_SHOW_NOTIFICATION && <MaintenanceNotification />}
            <div className={cx(styles.pageBody, { [styles.noKoro]: noKoro })}>
              {children}
            </div>
            <Footer />
          </div>
        </>
      )}
    </ClassNames>
  );
};

export default PageLayout;
