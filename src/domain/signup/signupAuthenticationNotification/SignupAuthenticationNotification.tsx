import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { SIGNUP_ACTIONS } from '../constants';
import { checkIsSignupActionAllowed } from '../permissions';

export type SignupAuthenticationNotificationProps = {
  action: SIGNUP_ACTIONS;
  registration: RegistrationFieldsFragment;
};

const SignupAuthenticationNotification: React.FC<
  SignupAuthenticationNotificationProps
> = ({ action, registration }) => {
  const { authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t('signup.form.notificationTitleCannotEdit')}
      getAuthorizationWarning={() =>
        checkIsSignupActionAllowed({
          action,
          authenticated,
          organizationAncestors,
          registration,
          t,
          user,
        })
      }
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdateSignupLabel'
      )}
      noRequiredOrganizationText={t('authentication.noRightsUpdateSignup')}
      requiredOrganizationType={[
        'admin',
        'registrationAdmin',
        'substituteUser',
      ]}
    />
  );
};

export default SignupAuthenticationNotification;
