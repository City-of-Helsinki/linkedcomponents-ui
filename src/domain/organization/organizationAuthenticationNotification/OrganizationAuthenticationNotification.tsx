import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type OrganizationAuthenticationNotificationProps = {
  action: ORGANIZATION_ACTIONS;
  className?: string;
  id: string;
};

const OrganizationAuthenticationNotification: React.FC<
  OrganizationAuthenticationNotificationProps
> = ({ action, className, id }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'organization.form.notificationTitleCannotEdit'
      )}
      className={className}
      getAuthorizationWarning={() =>
        checkIsEditActionAllowed({
          action,
          authenticated,
          id,
          t,
          user,
        })
      }
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateOrganizationLabel'
      )}
      noRequiredOrganizationText={t(
        'authentication.noRightsUpdateOrganization'
      )}
    />
  );
};

export default OrganizationAuthenticationNotification;
