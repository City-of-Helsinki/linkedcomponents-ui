import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
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
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'enrolment.form.notificationTitleCannotEdit'
      )}
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
        'authentication.noRightsUpdateSignupLabel'
      )}
      noRequiredOrganizationText={t('authentication.noRightsUpdateSignup')}
    />
  );
};

export default EnrolmentAuthenticationNotification;
