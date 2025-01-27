import { LoginProviderProps } from 'hds-react';

import { ROUTES } from '../../constants';

const origin = window.location.origin;

export const loginProviderProps: LoginProviderProps = {
  userManagerSettings: {
    authority: import.meta.env.REACT_APP_OIDC_AUTHORITY,
    client_id: import.meta.env.REACT_APP_OIDC_CLIENT_ID,
    scope: 'openid profile email',
    redirect_uri: `${origin}${ROUTES.CALLBACK}`,
    silent_redirect_uri: `${origin}${ROUTES.SILENT_CALLBACK}`,
    post_logout_redirect_uri: `${origin}${ROUTES.LOGOUT}`,
    response_type: 'code',
  },
  apiTokensClientSettings: {
    url: import.meta.env.REACT_APP_OIDC_API_TOKENS_URL,
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: [import.meta.env.REACT_APP_OIDC_API_SCOPE],
  },
  sessionPollerSettings: { pollIntervalInMs: 60000 },
};
