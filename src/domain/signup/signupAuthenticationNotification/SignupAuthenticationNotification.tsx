import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import { SIGNUP_ACTIONS } from '../../enrolment/constants';
import { checkIsEditActionAllowed } from '../../enrolment/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';

export type SignupAuthenticationNotificationProps = {
  action: SIGNUP_ACTIONS;
  registration: RegistrationFieldsFragment;
};

const SignupAuthenticationNotification: React.FC<
  SignupAuthenticationNotificationProps
> = ({ action, registration }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t('signup.form.notificationTitleCannotEdit')}
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

export default SignupAuthenticationNotification;
