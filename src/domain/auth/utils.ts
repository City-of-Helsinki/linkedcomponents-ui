import { UserManager, UserManagerSettings } from 'oidc-client';

import { API_SCOPE } from './constants';

const apiAccessTokenStorage = sessionStorage;

const storageKey = `oidc.apiToken.${API_SCOPE}`;

export const getApiTokenFromStorage = (): string | null =>
  apiAccessTokenStorage.getItem(storageKey);

export const setApiTokenToStorage = (accessToken: string): void =>
  apiAccessTokenStorage.setItem(storageKey, accessToken);

export const clearApiTokenFromStorage = (): void =>
  apiAccessTokenStorage.removeItem(storageKey);

export const createUserManager = (config: UserManagerSettings) => {
  return new UserManager(config);
};

export const processSilentRenew = (config: UserManagerSettings) => {
  const mgr = createUserManager(config);
  mgr.signinSilentCallback();
};
