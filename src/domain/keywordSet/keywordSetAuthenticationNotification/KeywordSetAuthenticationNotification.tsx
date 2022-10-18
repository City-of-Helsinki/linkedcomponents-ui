import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import useUserOrganization from '../../user/hooks/useUserOrganization';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS;
  className?: string;
  dataSource: string;
};

const KeywordSetAuthenticationNotification: React.FC<
  KeywordSetAuthenticationNotificationProps
> = ({ action, className, dataSource }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const { organization: userOrganization, loading: loadingUserOrganization } =
    useUserOrganization(user);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    if (authenticated && !loadingUserOrganization) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateKeywordSet')}</p>,
          label: t('authentication.noRightsUpdateKeywordSetLabel'),
        };
      }

      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        dataSource,
        t,
        userOrganization,
      });

      if (warning) {
        return {
          children: <p>{warning}</p>,
          label: t('keywordSet.form.notificationTitleCannotEdit'),
        };
      }
    }

    return { label: null };
  };

  return (
    <AuthenticationNotification
      {...getNotificationProps()}
      className={className}
    />
  );
};

export default KeywordSetAuthenticationNotification;
