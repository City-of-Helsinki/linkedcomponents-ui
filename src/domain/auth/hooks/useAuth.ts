import { useOidcClient } from 'hds-react';
import { User } from 'oidc-client-ts';
import { useLocation } from 'react-router';

import { OidcLoginState } from '../types';

type UseAuthState = {
  authenticated: boolean;
  login: (signInPath?: string) => Promise<void>;
  logout: (signInPath?: string) => Promise<void>;
  user: User | null;
};

const useAuth = (): UseAuthState => {
  const { isAuthenticated, getUser, login, logout } = useOidcClient();
  const location = useLocation();

  const handleLogin = async (signInPath?: string) => {
    const state: OidcLoginState = {
      path: signInPath ?? `${location.pathname}${location.search}`,
    };
    login({ state });
  };

  const handleLogout = async () => {
    logout();
  };

  return {
    authenticated: isAuthenticated(),
    login: handleLogin,
    logout: handleLogout,
    user: getUser(),
  };
};

export default useAuth;
