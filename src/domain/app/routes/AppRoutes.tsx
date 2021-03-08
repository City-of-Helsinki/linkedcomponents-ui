import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import OidcCallback from '../../auth/oidcCallback/OidcCallback';
import SilentCallback from '../../auth/silentCallback/SilentCallback';
import useApiToken from '../hooks/useApiToken';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(SUPPORTED_LANGUAGES).join('|')})`;

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  // Hook to update api token
  useApiToken();

  return (
    <Switch>
      <Route path={ROUTES.CALLBACK} component={OidcCallback} />
      <Route exact path={ROUTES.SILENT_CALLBACK} component={SilentCallback} />
      <Redirect exact path="/" to={`/${currentLocale}`} />
      <Route path={`/${localeParam}`} component={LocaleRoutes} />
      <Route
        render={(props) => (
          <Redirect
            to={`/${currentLocale}${props.location.pathname}${props.location.search}`}
          />
        )}
      />
    </Switch>
  );
};

export default AppRoutes;
