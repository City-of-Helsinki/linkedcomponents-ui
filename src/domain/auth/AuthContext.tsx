/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, UserManager } from 'oidc-client';
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../hooks/useLocale';
import { oidcInitialState } from './constants';
import useApiToken from './hooks/useApiToken';
import { reducers } from './reducers';
import { AuthContextProps, AuthProviderProps } from './types';
import {
  getIsAuthenticated,
  getIsLoading,
  loadUser as loadUserFn,
  onAccessTokenExpired as onAccessTokenExpiredFn,
  onAccessTokenExpiring as onAccessTokenExpiringFn,
  onSilentRenewError as onSilentRenewErrorFn,
  onUserLoaded as onUserLoadedFn,
  onUserSignedOut as onUserSignedOutFn,
  onUserUnloaded as onUserUnloadedFn,
  signIn,
  signOut,
} from './utils';

export const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

const initUserManager = (props: AuthProviderProps): UserManager => {
  return props.userManager;
};

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [userManager] = useState<UserManager>(() => initUserManager(props));

  const [oidcState, dispatchOidcState] = useReducer(
    reducers.oidcReducer,
    oidcInitialState
  );

  const { apiTokenState, resetApiTokenData } = useApiToken(oidcState);

  const {
    loadUser,
    onAccessTokenExpired,
    onAccessTokenExpiring,
    onSilentRenewError,
    onUserLoaded,
    onUserSignedOut,
    onUserUnloaded,
  } = useMemo(() => {
    /* istanbul ignore next */
    return {
      loadUser: () => loadUserFn({ dispatchOidcState, userManager }),
      onAccessTokenExpired: () => onAccessTokenExpiredFn({ dispatchOidcState }),
      onAccessTokenExpiring: () =>
        onAccessTokenExpiringFn({ dispatchOidcState }),
      onSilentRenewError: () => onSilentRenewErrorFn({ dispatchOidcState }),
      onUserSignedOut: () => onUserSignedOutFn({ dispatchOidcState }),
      onUserUnloaded: () => onUserUnloadedFn({ dispatchOidcState }),
      onUserLoaded: (user: User) => onUserLoadedFn({ dispatchOidcState, user }),
    };
  }, [userManager]);

  useEffect(() => {
    // Load user automatically on mount
    loadUser();

    userManager.events.addAccessTokenExpired(onAccessTokenExpired);
    userManager.events.addAccessTokenExpiring(onAccessTokenExpiring);
    userManager.events.addSilentRenewError(onSilentRenewError);
    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserSignedOut(onUserSignedOut);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
      userManager.events.removeAccessTokenExpiring(onAccessTokenExpiring);
      userManager.events.removeSilentRenewError(onSilentRenewError);
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserSignedOut(onUserSignedOut);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextProps>(() => {
    return {
      signIn: async (path?: string) => signIn({ userManager, locale, t, path }),
      signOut: async () => signOut({ resetApiTokenData, userManager }),
      userManager,
      ...oidcState,
      ...apiTokenState,
      isAuthenticated: getIsAuthenticated({ apiTokenState, oidcState }),
      isLoading: getIsLoading({ apiTokenState, oidcState }),
    };
  }, [apiTokenState, locale, oidcState, resetApiTokenData, t, userManager]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
