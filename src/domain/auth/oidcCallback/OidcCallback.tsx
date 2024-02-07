/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LoginCallbackHandler, useApiTokensClient } from 'hds-react';
import { User } from 'oidc-client-ts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { OidcLoginState } from '../types';

const OidcCallback: React.FC = () => {
  const location = useLocation();
  const { fetch } = useApiTokensClient();
  const { addNotification } = useNotificationsContext();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const onSuccess = async (user: User) => {
    try {
      await fetch(user);
    } catch {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch api tokens');
    }

    const path = (user.state as OidcLoginState)?.path;
    if (path) navigate(path);
    else navigate('/', { replace: true });
  };

  const onError = () => {
    // In case used denies the access
    if (new URLSearchParams(location.hash.replace('#', '?')).get('error')) {
      navigate('/', { replace: true });
    } else if (
      new URLSearchParams(location.search).get('error') === 'access_denied'
    ) {
      addNotification({
        type: 'error',
        label: t('common.authError.accessDenied'),
      });
      navigate('/', { replace: true });
    }
  };

  return (
    <LoginCallbackHandler onSuccess={onSuccess} onError={onError}>
      <LoadingSpinner isLoading />
    </LoginCallbackHandler>
  );
};

export default OidcCallback;
