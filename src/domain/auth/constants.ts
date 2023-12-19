import { LoginProviderProps } from 'hds-react';

import { ROUTES } from '../../constants';

export const API_SCOPE =
  import.meta.env.REACT_APP_OIDC_API_SCOPE ||
  'https://api.hel.fi/auth/linkedevents';

const origin = window.location.origin;

export const loginProviderProps: LoginProviderProps = {
  userManagerSettings: {
    authority: import.meta.env.REACT_APP_OIDC_AUTHORITY,
    client_id: import.meta.env.REACT_APP_OIDC_CLIENT_ID,
    scope: 'openid profile',
    redirect_uri: `${origin}${ROUTES.CALLBACK}`,
    silent_redirect_uri: `${origin}${ROUTES.SILENT_CALLBACK}`,
    post_logout_redirect_uri: `${origin}${ROUTES.LOGOUT}`,
  },
  apiTokensClientSettings: {
    url: import.meta.env.REACT_APP_OIDC_API_TOKENS_URL,
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: [import.meta.env.REACT_APP_OIDC_API_SCOPE],
  },
  sessionPollerSettings: { pollIntervalInMs: 10000 },
};
