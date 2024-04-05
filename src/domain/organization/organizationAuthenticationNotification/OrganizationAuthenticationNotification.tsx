import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import useAuth from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_MERCHANT_ACTIONS,
} from '../constants';
import {
  checkCanUserDoMerchantAction,
  checkIsEditOrganizationActionAllowed,
} from '../utils';

export type OrganizationAuthenticationNotificationProps = {
  action: ORGANIZATION_ACTIONS;
  className?: string;
  id: string;
};

const OrganizationAuthenticationNotification: React.FC<
  OrganizationAuthenticationNotificationProps
> = ({ action, className, id }) => {
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'organization.form.notificationTitleCannotEdit'
      )}
      className={className}
      getAuthorizationWarning={() => {
        let { editable, warning } = checkIsEditOrganizationActionAllowed({
          action,
          authenticated,
          id,
          t,
          user,
        });

        // Don't display warning if user is allowed to update or create organization merchants
        if (
          (action === ORGANIZATION_ACTIONS.CREATE ||
            action === ORGANIZATION_ACTIONS.UPDATE) &&
          checkCanUserDoMerchantAction({
            action:
              action === ORGANIZATION_ACTIONS.CREATE
                ? ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_CREATE
                : ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_UPDATE,
            organizationId: id,
            user,
          })
        ) {
          editable = true;
          warning = '';
        }

        return { editable, warning };
      }}
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateOrganizationLabel'
      )}
      noRequiredOrganizationText={t(
        'authentication.noRightsUpdateOrganization'
      )}
      requiredOrganizationType={['admin', 'financialAdmin']}
    />
  );
};

export default OrganizationAuthenticationNotification;
