import { StoreState } from '../../types';

export const userAccessTokenSelector = (state: StoreState) =>
  state.authentication.oidc.user?.access_token;

export const userSelector = (state: StoreState) =>
  state.authentication.oidc.user;

export const apiTokenSelector = (state: StoreState) =>
  state.authentication.token.apiToken;

export const loadingSelector = (state: StoreState) =>
  state.authentication.oidc.isLoadingUser || state.authentication.token.loading;

export const authenticatedSelector = (state: StoreState) =>
  !!state.authentication.oidc.user && !!state.authentication.token.apiToken;
