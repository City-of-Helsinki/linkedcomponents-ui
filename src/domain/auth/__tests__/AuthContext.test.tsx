/* eslint-disable no-console */
/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { render, waitFor } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { NotificationsProvider } from '../../app/notificationsContext/NotificationsContext';
import { ThemeProvider } from '../../app/theme/Theme';
import { AuthContext, AuthProvider } from '../AuthContext';
import { OidcActionTypes } from '../constants';
import { reducers } from '../reducers';

function oidcEvent(fn: any) {
  fn();
}

const events = {
  addAccessTokenExpired: () => undefined,
  addAccessTokenExpiring: () => undefined,
  addSilentRenewError: () => undefined,
  addUserLoaded: () => undefined,
  addUserSignedOut: () => undefined,
  addUserUnloaded: () => undefined,
  removeAccessTokenExpired: () => undefined,
  removeAccessTokenExpiring: () => undefined,
  removeSilentRenewError: () => undefined,
  removeUserLoaded: () => undefined,
  removeUserSignedOut: () => undefined,
  removeUserUnloaded: () => undefined,
};

vi.mock('oidc-client-ts', () => {
  return {
    UserManager: vi.fn().mockImplementation(() => {
      return {
        getUser: vi.fn(),
        signinRedirect: vi.fn(),
        events,
      };
    }),
  };
});

const NotificationsProviderWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <NotificationsProvider>{children}</NotificationsProvider>;
};

describe('AuthContext', () => {
  it('should sign in', async () => {
    const u = {
      getUser: vi.fn(async () => undefined),
      signinRedirect: vi.fn(async () => undefined),
      events,
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={u}>
            <AuthContext.Consumer>
              {(value) => {
                value?.signIn();
                return <div />;
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() => expect(u.getUser).toHaveBeenCalled());
    await waitFor(() => expect(u.signinRedirect).toHaveBeenCalled());
  });

  it('should get user', async () => {
    const oidcReducerSpy = vi.spyOn(reducers, 'oidcReducer');
    const user = { access_token: 'token', expired: false };
    const userManager = {
      getUser: async () => user,
      signinCallback: vi.fn(),
      events,
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={userManager} />
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: user,
        type: OidcActionTypes.USER_FOUND,
      })
    );
  });

  it('should refresh user when new data is available', async () => {
    const oidcReducerSpy = vi.spyOn(reducers, 'oidcReducer');
    const user = { access_token: 'token', expired: false };
    const userManager = {
      getUser: async () => user,
      signinCallback: vi.fn(),
      events: {
        ...events,
        addUserLoaded: oidcEvent,
        removeUserLoaded: () => undefined,
      },
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={userManager} />
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: user,
        type: OidcActionTypes.USER_FOUND,
      })
    );
    expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
      payload: undefined,
      type: OidcActionTypes.USER_FOUND,
    });
  });

  it('should show console error message when loading user fails', async () => {
    const oidcReducerSpy = vi.spyOn(reducers, 'oidcReducer');
    console.error = vi.fn();
    const userManager = {
      getUser: vi.fn().mockRejectedValue({ message: 'error' }),
      signinCallback: vi.fn(),
      events,
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={userManager} />
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: null,
        type: OidcActionTypes.LOAD_USER_ERROR,
      })
    );
    expect(console.error).toBeCalledWith(
      'AuthContext: Error in loadUser() function: error'
    );
  });

  it('should clear user when user is expired', async () => {
    const oidcReducerSpy = vi.spyOn(reducers, 'oidcReducer');
    const userManager = {
      getUser: async () => ({ access_token: 'token', expired: true }),
      signinCallback: vi.fn(),
      events,
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={userManager} />
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: null,
        type: OidcActionTypes.USER_EXPIRED,
      })
    );
  });

  it('should logout the user', async () => {
    const oidcReducerSpy = vi.spyOn(reducers, 'oidcReducer');

    const u = {
      getUser: async () => ({ access_token: 'token', expired: false }),
      removeUser: vi.fn(),
      signoutRedirect: vi.fn(),
      events: {
        ...events,
        addUserSignedOut: oidcEvent,
      },
    } as any;

    render(
      <ThemeProvider>
        <NotificationsProviderWrapper>
          <AuthProvider userManager={u}>
            <AuthContext.Consumer>
              {(value) => {
                value?.signOut();
                return <div />;
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </NotificationsProviderWrapper>
      </ThemeProvider>
    );

    await waitFor(() => expect(u.signoutRedirect).toHaveBeenCalled());
    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: null,
        type: OidcActionTypes.USER_SIGNED_OUT,
      })
    );
  });
});
