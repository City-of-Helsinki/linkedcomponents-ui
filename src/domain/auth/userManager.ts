import Oidc, { UserManagerSettings } from 'oidc-client-ts';

import { ROUTES } from '../../constants';
import { createUserManager } from './utils';

const origin = window.location.origin;

const enableOidcLogging = () => {
  Oidc.Log.setLogger(console);
};

if (import.meta.env.NODE_ENV === 'development') {
  enableOidcLogging();
}

const settings: UserManagerSettings = {
  authority: import.meta.env.REACT_APP_OIDC_AUTHORITY,
  automaticSilentRenew: true,
  client_id: import.meta.env.REACT_APP_OIDC_CLIENT_ID,
  redirect_uri: `${origin}${ROUTES.CALLBACK}`,
  loadUserInfo: true,
  response_type:
    import.meta.env.REACT_APP_OIDC_RESPONSE_TYPE || 'id_token token',
  silent_redirect_uri: `${origin}${ROUTES.SILENT_CALLBACK}`,
  scope: `openid profile email ${import.meta.env.REACT_APP_OIDC_API_SCOPE}`,
  post_logout_redirect_uri: `${origin}${ROUTES.LOGOUT}`,
};

const userManager = createUserManager(settings);

export default userManager;
