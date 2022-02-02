import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import useRegistrationPublisher from '../hooks/useRegistrationPublisher';
import { checkIsEditActionAllowed } from '../utils';

export type RegistrationAuthenticationNotificationProps = {
  action: REGISTRATION_ACTIONS;
  className?: string;
  registration?: RegistrationFieldsFragment;
};

const RegistrationAuthenticationNotification: React.FC<RegistrationAuthenticationNotificationProps> =
  ({ action, className, registration }) => {
    const authenticated = useSelector(authenticatedSelector);
    const { user } = useUser();
    const adminOrganizations = user?.adminOrganizations || [];
    const publisher = useRegistrationPublisher({ registration }) as string;
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
