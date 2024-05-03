import { useApiTokens, useOidcClient } from 'hds-react';
import { User } from 'oidc-client-ts';
import { useCallback } from 'react';
import { useLocation } from 'react-router';

import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import { OidcLoginState } from '../types';

type UseAuthState = {
  authenticated: boolean;
  getApiToken: () => string | null;
  login: (signInPath?: string) => Promise<void>;
  logout: (signInPath?: string) => Promise<void>;
  user: User | null;
};

const useAuth = (): UseAuthState => {
  const locale = useLocale();
  const { isAuthenticated, getUser, login, logout } = useOidcClient();
  const { getStoredApiTokens } = useApiTokens();

  const getApiToken = useCallback(
    () =>
      getValue(
        getStoredApiTokens()[1]?.[import.meta.env.REACT_APP_OIDC_API_SCOPE],
        null
      ),
    [getStoredApiTokens]
  );

  const location = useLocation();

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
    getApiToken,
    login: handleLogin,
    logout: handleLogout,
    user: getUser(),
  };
};

export default useAuth;
