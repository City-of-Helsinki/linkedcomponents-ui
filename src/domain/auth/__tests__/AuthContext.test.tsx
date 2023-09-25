/* eslint-disable no-console */
/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { render, waitFor } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { NotificationsProvider } from '../../app/notificationsContext/NotificationsContext';
import { AuthContext, AuthProvider } from '../AuthContext';
import { OidcActionTypes } from '../constants';
import { reducers } from '../reducers';

function oidcEvent(fn) {
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

jest.mock('oidc-client', () => {
  return {
    UserManager: jest.fn().mockImplementation(() => {
      return {
        getUser: jest.fn(),
        signinRedirect: jest.fn(),
        events,
      };
    }),
  };
});

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <NotificationsProvider>{children}</NotificationsProvider>;
};

describe('AuthContext', () => {
  it('should sign in', async () => {
    const u = {
      getUser: jest.fn(async () => undefined),
      signinRedirect: jest.fn(async () => undefined),
      events,
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={u}>
          <AuthContext.Consumer>
            {(value) => {
              value?.signIn();
              return <div />;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      </Wrapper>
    );

    await waitFor(() => expect(u.getUser).toHaveBeenCalled());
    await waitFor(() => expect(u.signinRedirect).toHaveBeenCalled());
  });

  it('should get user', async () => {
    const oidcReducerSpy = jest.spyOn(reducers, 'oidcReducer');
    const user = { access_token: 'token', expired: false };
    const userManager = {
      getUser: async () => user,
      signinCallback: jest.fn(),
      events,
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={userManager} />
      </Wrapper>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: user,
        type: OidcActionTypes.USER_FOUND,
      })
    );
  });

  it('should refresh user when new data is available', async () => {
    const oidcReducerSpy = jest.spyOn(reducers, 'oidcReducer');
    const user = { access_token: 'token', expired: false };
    const userManager = {
      getUser: async () => user,
      signinCallback: jest.fn(),
      events: {
        ...events,
        addUserLoaded: oidcEvent,
        removeUserLoaded: () => undefined,
      },
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={userManager} />
      </Wrapper>
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
    const oidcReducerSpy = jest.spyOn(reducers, 'oidcReducer');
    console.error = jest.fn();
    const userManager = {
      getUser: jest.fn().mockRejectedValue({ message: 'error' }),
      signinCallback: jest.fn(),
      events,
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={userManager} />
      </Wrapper>
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
    const oidcReducerSpy = jest.spyOn(reducers, 'oidcReducer');
    const userManager = {
      getUser: async () => ({ access_token: 'token', expired: true }),
      signinCallback: jest.fn(),
      events,
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={userManager} />
      </Wrapper>
    );

    await waitFor(() =>
      expect(oidcReducerSpy).toBeCalledWith(expect.objectContaining({}), {
        payload: null,
        type: OidcActionTypes.USER_EXPIRED,
      })
    );
  });

  it('should logout the user', async () => {
    const oidcReducerSpy = jest.spyOn(reducers, 'oidcReducer');

    const u = {
      getUser: async () => ({ access_token: 'token', expired: false }),
      removeUser: jest.fn(),
      signoutRedirect: jest.fn(),
      events: {
        ...events,
        addUserSignedOut: oidcEvent,
      },
    } as any;

    render(
      <Wrapper>
        <AuthProvider userManager={u}>
          <AuthContext.Consumer>
            {(value) => {
              value?.signOut();
              return <div />;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      </Wrapper>
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
