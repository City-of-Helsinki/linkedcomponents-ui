import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import { checkIsRegistrationActionAllowed } from '../permissions';

export type RegistrationAuthenticationNotificationProps = {
  action: REGISTRATION_ACTIONS;
  className?: string;
  registration?: RegistrationFieldsFragment | null;
};

const RegistrationAuthenticationNotification: React.FC<
  RegistrationAuthenticationNotificationProps
> = ({ action, className, registration }) => {
  const { authenticated } = useAuth();
  const { user } = useUser();

  const publisher = getValue(registration?.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'registration.form.notificationTitleCannotEdit'
      )}
      className={className}
      getAuthorizationWarning={() =>
        checkIsRegistrationActionAllowed({
          action,
          authenticated,
          organizationAncestors,
          registration: registration ?? undefined,
          t,
          user,
        })
      }
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateRegistrationLabel'
      )}
      noRequiredOrganizationText={t(
        'authentication.noRightsUpdateRegistration'
      )}
      requiredOrganizationType={['admin', 'registrationAdmin']}
    />
  );
};

export default RegistrationAuthenticationNotification;
