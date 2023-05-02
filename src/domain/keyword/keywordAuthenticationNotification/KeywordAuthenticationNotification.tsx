import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type KeywordAuthenticationNotificationProps = {
  action: KEYWORD_ACTIONS;
  className?: string;
  publisher: string;
};

const KeywordAuthenticationNotification: React.FC<
  KeywordAuthenticationNotificationProps
> = ({ action, className, publisher }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t('keyword.form.notificationTitleCannotEdit')}
      className={className}
      getAuthorizationWarning={() =>
        checkIsEditActionAllowed({
          action,
          authenticated,
          organizationAncestors,
          publisher,
          t,
          user,
        })
      }
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateKeywordLabel'
      )}
      noRequiredOrganizationText={t('authentication.noRightsUpdateKeyword')}
    />
  );
};

export default KeywordAuthenticationNotification;
