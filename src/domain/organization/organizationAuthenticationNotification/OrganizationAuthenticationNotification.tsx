import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type OrganizationAuthenticationNotificationProps = {
  action: ORGANIZATION_ACTIONS;
  id: string;
};

const OrganizationAuthenticationNotification: React.FC<OrganizationAuthenticationNotificationProps> =
  ({ action, id }) => {
    const authenticated = useSelector(authenticatedSelector);
    const { user } = useUser();
    const adminOrganizations = user?.adminOrganizations || [];
    const { organizationAncestors } = useOrganizationAncestors(id);

    const { t } = useTranslation();

    const getNotificationProps = () => {
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
          organizationAncestors,
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

    return <AuthenticationNotification {...getNotificationProps()} />;
  };

export default OrganizationAuthenticationNotification;
