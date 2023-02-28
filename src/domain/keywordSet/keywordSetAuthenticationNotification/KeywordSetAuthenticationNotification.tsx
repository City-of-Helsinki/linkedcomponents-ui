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
  const { organization: userOrganization } = useUserOrganization(user);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'keywordSet.form.notificationTitleCannotEdit'
      )}
      className={className}
      getAuthorizationWarning={() =>
        checkIsEditActionAllowed({
          action,
          authenticated,
          dataSource,
          t,
          userOrganization,
        })
      }
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateKeywordSetLabel'
      )}
      noRequiredOrganizationText={t('authentication.noRightsUpdateKeywordSet')}
    />
  );
};

export default KeywordSetAuthenticationNotification;
