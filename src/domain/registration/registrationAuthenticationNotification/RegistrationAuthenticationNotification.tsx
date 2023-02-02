import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import useRegistrationPublisher from '../hooks/useRegistrationPublisher';
import { checkIsEditActionAllowed } from '../utils';

export type RegistrationAuthenticationNotificationProps = {
  action: REGISTRATION_ACTIONS;
  className?: string;
  registration?: RegistrationFieldsFragment | null;
};

const RegistrationAuthenticationNotification: React.FC<
  RegistrationAuthenticationNotificationProps
> = ({ action, className, registration }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const adminOrganizations = getValue(user?.adminOrganizations, []);
  const publisher = getValue(useRegistrationPublisher({ registration }), '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateRegistration')}</p>,
          label: t('authentication.noRightsUpdateRegistrationLabel'),
        };
      }

      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        organizationAncestors,
        publisher,
        t,
        user,
      });

      if (warning) {
        return {
          children: <p>{warning}</p>,
          label: t('registration.form.notificationTitleCannotEdit'),
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

export default RegistrationAuthenticationNotification;
