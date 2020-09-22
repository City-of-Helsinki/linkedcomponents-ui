import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(SUPPORTED_LANGUAGES).join('|')})`;

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  return (
    <Switch>
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
