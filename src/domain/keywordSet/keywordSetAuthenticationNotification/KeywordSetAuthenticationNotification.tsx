import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS;
  className?: string;
  organization: string;
};

const KeywordSetAuthenticationNotification: React.FC<
  KeywordSetAuthenticationNotificationProps
> = ({ action, className, organization }) => {
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(organization);

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
          organizationAncestors,
          organization,
          t,
          user,
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
