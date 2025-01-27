import { useApiTokens, useOidcClient } from 'hds-react';
import { User } from 'oidc-client-ts';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import useLocale from '../../../hooks/useLocale';
import { OidcLoginState } from '../types';

type UseAuthState = {
  authenticated: boolean;
  isRenewing: boolean;
  apiToken: string | undefined;
  login: (signInPath?: string) => Promise<void>;
  logout: (signInPath?: string) => Promise<void>;
  user: User | null;
};

const useAuth = (): UseAuthState => {
  const locale = useLocale();

  const {
    isAuthenticated,
    getUser,
    getToken,
    login,
    logout,
    isRenewing: isRenewingUser,
  } = useOidcClient();

  const { isRenewing: isRenewingTokens, getStoredApiTokens } = useApiTokens();

  const [error, tokens] = getStoredApiTokens();

  const isRenewing = isRenewingUser() || isRenewingTokens();

  const getApiToken = useCallback(async () => {
    if (!tokens) {
      if (isRenewing || error) {
        const token = await getToken('access');

        return token;
      }
    }

    return tokens
      ? tokens[`${import.meta.env.REACT_APP_OIDC_API_SCOPE}`]
      : undefined;
  }, [error, getToken, isRenewing, tokens]);

  const location = useLocation();

  const [apiToken, setApiToken] = useState<string | undefined>(
    tokens ? tokens[`${import.meta.env.REACT_APP_OIDC_API_SCOPE}`] : undefined
  );

  useEffect(() => {
    const fetchApiToken = async () => {
      const newApiToken = await getApiToken();

      setApiToken(newApiToken);
    };

    fetchApiToken();
  }, [getApiToken]);

  const handleLogin = async (signInPath?: string) => {
    const state: OidcLoginState = {
      path: signInPath ?? `${location.pathname}${location.search}`,
    };
    login({ language: locale, state });
  };

  const handleLogout = async () => {
    logout();
  };

  return {
    authenticated: isAuthenticated(),
    isRenewing,
    apiToken,
    login: handleLogin,
    logout: handleLogout,
    user: getUser(),
  };
};

export default useAuth;
