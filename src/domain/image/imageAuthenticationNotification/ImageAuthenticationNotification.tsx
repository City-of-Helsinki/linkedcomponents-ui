import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { IMAGE_ACTIONS } from '../constants';
import { checkIsImageActionAllowed } from '../utils';

export type ImageAuthenticationNotificationProps = {
  action: IMAGE_ACTIONS;
  className?: string;
  publisher: string;
};

const ImageAuthenticationNotification: React.FC<
  ImageAuthenticationNotificationProps
> = ({ action, className, publisher }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t('image.form.notificationTitleCannotEdit')}
      className={className}
      getAuthorizationWarning={() =>
        checkIsImageActionAllowed({
          action,
          authenticated,
          organizationAncestors,
          publisher,
          t,
          user,
        })
      }
      noRequiredOrganizationLabel={t('authentication.noRightsUpdateImageLabel')}
      noRequiredOrganizationText={t('authentication.noRightsUpdateImage')}
    />
  );
};

export default ImageAuthenticationNotification;
