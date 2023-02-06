import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useRegistrationPublisher from '../../registration/hooks/useRegistrationPublisher';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type EnrolmentAuthenticationNotificationProps = {
  action: ENROLMENT_ACTIONS;
  registration: RegistrationFieldsFragment;
};

const EnrolmentAuthenticationNotification: React.FC<
  EnrolmentAuthenticationNotificationProps
> = ({ action, registration }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const publisher = useRegistrationPublisher({ registration }) as string;
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    /* istanbul ignore else */
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateEnrolment')}</p>,
          label: t('authentication.noRightsUpdateEnrolmentLabel'),
        };
      }

      /* istanbul ignore else */
      if (registration) {
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
            label: t('enrolment.form.notificationTitleCannotEdit'),
          };
        }
      }
    }

    return { label: null };
  };

  return <AuthenticationNotification {...getNotificationProps()} />;
};

export default EnrolmentAuthenticationNotification;
