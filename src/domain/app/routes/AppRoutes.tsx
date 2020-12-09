import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';

import { ROUTES, SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { resetApiTokenData } from '../../auth/actions';
import { getApiToken } from '../../auth/authenticate';
import OidcCallback from '../../auth/oidcCallback/OidcCallback';
import { userSelector } from '../../auth/selectors';
import SilentCallback from '../../auth/silentCallback/SilentCallback';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(SUPPORTED_LANGUAGES).join('|')})`;

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  React.useEffect(() => {
    // Get new api token after new access token
    if (user?.access_token) {
      dispatch(getApiToken(user.access_token));
    } else {
      dispatch(resetApiTokenData());
    }
  }, [dispatch, user]);

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
