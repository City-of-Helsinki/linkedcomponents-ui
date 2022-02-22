import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { authenticatedSelector } from '../../auth/selectors';
import useUser from '../../user/hooks/useUser';
import useUserOrganization from '../../user/hooks/useUserOrganization';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS;
  dataSource: string;
};

const KeywordSetAuthenticationNotification: React.FC<KeywordSetAuthenticationNotificationProps> =
  ({ action, dataSource }) => {
    const authenticated = useSelector(authenticatedSelector);
    const { user } = useUser();
    const adminOrganizations = user?.adminOrganizations || [];
    const { organization: userOrganization } = useUserOrganization(user);

    const { t } = useTranslation();

    const getNotificationProps = () => {
      if (authenticated) {
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

    return <AuthenticationNotification {...getNotificationProps()} />;
  };

export default KeywordSetAuthenticationNotification;
