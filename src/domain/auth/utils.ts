import { UserManager, UserManagerSettings } from 'oidc-client-ts';

const apiAccessTokenStorage = sessionStorage;

const storageKey = 'hds_login_api_token_storage_key';

export const getApiTokenFromStorage = (): string | null => {
  const apiTokensStr = apiAccessTokenStorage.getItem(storageKey);

  if (apiTokensStr) {
    return JSON.parse(apiTokensStr)[import.meta.env.REACT_APP_OIDC_API_SCOPE];
  }

  return null;
};

export const setApiTokenToStorage = (apiToken: string): void =>
  apiAccessTokenStorage.setItem(
    storageKey,
    JSON.stringify({ [import.meta.env.REACT_APP_OIDC_API_SCOPE]: apiToken })
  );

/* istanbul ignore next */
export const createUserManager = (config: UserManagerSettings) => {
  return new UserManager(config);
};
