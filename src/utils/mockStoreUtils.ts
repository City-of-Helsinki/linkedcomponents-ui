/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from 'lodash/merge';
import { Profile, User } from 'oidc-client';
import { UserState } from 'redux-oidc';

import { defaultStoreState } from '../constants';
import { API_CLIENT_ID } from '../domain/auth/constants';
import { ReducerState as AuthState, TokenState } from '../domain/auth/types';
import {
  EventListOptionsState,
  ExpandedEventsState,
  ReducerState as EventsState,
} from '../domain/events/types';
import { StoreState } from '../types';

export const fakeStoreState = (overrides?: Partial<StoreState>): StoreState =>
  merge<StoreState, typeof overrides>(
    {
      ...defaultStoreState,
    },
    overrides
  );

export const fakeAuthenticatedStoreState = (
  overrides?: Partial<StoreState>
): StoreState =>
  merge<StoreState, typeof overrides>(
    {
      ...defaultStoreState,
      authentication: fakeAuthenticationState(),
    },
    overrides
  );

export const fakeEventsState = (
  overrides?: Partial<EventsState>
): EventsState =>
  merge<EventsState, typeof overrides>(
    {
      expandedEvents: fakeExpandedEventsState(),
      listOptions: fakeEventsListOptionsState(),
    },
    overrides
  );

export const fakeEventsListOptionsState = (
  overrides?: Partial<EventListOptionsState>
): EventListOptionsState =>
  merge<EventListOptionsState, typeof overrides>(
    { ...defaultStoreState.events.listOptions },
    overrides
  );

export const fakeExpandedEventsState = (
  overrides?: Partial<ExpandedEventsState>
): ExpandedEventsState =>
  merge<ExpandedEventsState, typeof overrides>(
    { ...defaultStoreState.events.expandedEvents },
    overrides
  );

export const fakeAuthenticationState = (
  overrides?: Partial<AuthState>
): AuthState =>
  merge<AuthState, typeof overrides>(
    {
      oidc: fakeOidcState(),
      token: fakeTokenState(),
    },
    overrides
  );

export const fakeTokenState = (overrides?: Partial<TokenState>): TokenState =>
  merge<TokenState, typeof overrides>(
    {
      apiToken: { [API_CLIENT_ID]: 'api-token' },
      errors: {},
      loading: false,
    },
    overrides
  );

export const fakeOidcState = (overrides?: Partial<UserState>): UserState =>
  merge<UserState, typeof overrides>(
    {
      ...defaultStoreState.authentication.oidc,
      user: fakeOidcUserState(),
    },
    overrides
  );

export const fakeOidcUserState = (overrides?: Partial<User>): User =>
  merge<User, typeof overrides>(
    {
      access_token: '',
      expires_at: 0,
      expires_in: 0,
      expired: false,
      id_token: '',
      profile: fakeOidcUserProfileState(),
      toStorageString: jest.fn(),
      scope: '',
      scopes: [],
      state: null,
      token_type: '',
    },
    overrides
  );

export const fakeOidcUserProfileState = (
  overrides?: Partial<Profile>
): Profile =>
  merge<Profile, typeof overrides>(
    {
      aud: '',
      exp: 0,
      iat: 0,
      iss: '',
      name: 'Test user',
      sub: 'user:1',
    },
    overrides
  );
