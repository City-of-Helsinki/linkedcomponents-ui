/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, UserManager } from 'oidc-client-ts';

import { ApiTokenActionTypes, OidcActionTypes } from '../auth/constants';

export interface AuthProviderProps {
  /**
   * See [UserManager](https://github.com/authts/oidc-client-ts) for more details.
   */
  userManager: UserManager;
}

export interface AuthContextActions {
  /**
   * Alias for userManager.signInRedirect
   */
  signIn: (path?: string) => Promise<void>;
  /**
   * Alias for userManager.signOutRedirect
   */
  signOut: () => Promise<void>;
}

export interface OidcAction {
  type: OidcActionTypes;
  payload: User | null;
}

export interface OidcUserState {
  path: string;
}

export interface OidcReducerState {
  isLoadingUser: boolean;
  user: User | null;
}

export interface ApiTokenAction {
  type: ApiTokenActionTypes;
  payload: any;
}

export type ApiTokenReducerState = {
  apiToken: string | null;
  tokenErrors: Record<string, unknown>;
  isLoadingApiToken: boolean;
};

export type AuthContextProps = {
  /**
   * See [UserManager](https://authts.github.io/oidc-client-ts/classes/UserManager.html) for more details.
   */
  userManager: UserManager;
  isAuthenticated: boolean;
  isLoading: boolean;
} & OidcReducerState &
  AuthContextActions &
  ApiTokenReducerState;
