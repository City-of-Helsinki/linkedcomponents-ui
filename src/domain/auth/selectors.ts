import { User } from 'oidc-client';

import { StoreState } from '../../types';
import { TokenResponse } from './types';

export const userAccessTokenSelector = (
  state: StoreState
): string | undefined => state.authentication.oidc.user?.access_token;

export const userSelector = (state: StoreState): User | undefined =>
  state.authentication.oidc.user;

export const apiTokenSelector = (state: StoreState): TokenResponse | null =>
  state.authentication.token.apiToken;

export const loadingSelector = (state: StoreState): boolean =>
  state.authentication.oidc.isLoadingUser || state.authentication.token.loading;

export const authenticatedSelector = (state: StoreState): boolean =>
  !!state.authentication.oidc.user && !!state.authentication.token.apiToken;
