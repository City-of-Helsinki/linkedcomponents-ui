/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LoginCallbackHandler, LoginProvider } from 'hds-react';
import { User } from 'oidc-client-ts';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { loginProviderProps } from '../constants';
import { OidcLoginState } from '../types';

const OidcCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onSuccess = (user: User) => {
    const path = (user.state as OidcLoginState)?.path;
    if (path) navigate(path);
    else navigate('/', { replace: true });
  };

  const onError = () => {
    // In case used denies the access
    if (new URLSearchParams(location.hash.replace('#', '?')).get('error')) {
      navigate('/', { replace: true });
    }
  };

  return (
    <LoginProvider {...loginProviderProps}>
      <LoginCallbackHandler onSuccess={onSuccess} onError={onError}>
        <div>Logging in...</div>
      </LoginCallbackHandler>
    </LoginProvider>
  );
};

export default OidcCallback;
