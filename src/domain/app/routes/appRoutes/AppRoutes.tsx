import React from 'react';
import { matchPath, Navigate, Route, Routes, useLocation } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import OidcCallback from '../../../auth/oidcCallback/OidcCallback';
import SilentCallback from '../../../auth/silentCallback/SilentCallback';
import useApiToken from '../../hooks/useApiToken';
import LocaleRoutes from '../localeRoutes/LocaleRoutes';

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();
  const location = useLocation();

  // Hook to update api token
  useApiToken();

  const isMatch = (locale: string) =>
    matchPath({ path: `/${locale}/*`, end: true }, location.pathname);

  return (
    <Routes>
      <Route path={ROUTES.CALLBACK} element={<OidcCallback />} />
      <Route path={ROUTES.SILENT_CALLBACK} element={<SilentCallback />} />
      <Route path="/" element={<Navigate replace to={`/${currentLocale}`} />} />
      {Object.values(SUPPORTED_LANGUAGES).map((locale) => {
        if (isMatch(locale)) {
          return (
            <Route
              key={locale}
              path={`/:locale/*`}
              element={<LocaleRoutes />}
            />
          );
        }

        return (
          <Route
            key={locale}
            path="*"
            element={
              <Navigate
                replace
                to={`/${currentLocale}${location.pathname}${location.search}`}
              />
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
