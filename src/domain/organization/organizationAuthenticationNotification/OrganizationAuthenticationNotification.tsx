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
  const adminOrganizations = user?.adminOrganizations || [];

  const { t } = useTranslation();

  const getNotificationProps = () => {
    /* istanbul ignore else */
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateOrganization')}</p>,
          label: t('authentication.noRightsUpdateOrganizationLabel'),
        };
      }

      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        id,
        t,
        user,
      });

      if (warning) {
        return {
          children: <p>{warning}</p>,
          label: t('organization.form.notificationTitleCannotEdit'),
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

export default OrganizationAuthenticationNotification;
