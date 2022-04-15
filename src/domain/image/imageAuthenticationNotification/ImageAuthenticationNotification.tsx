import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { authenticatedSelector } from '../../auth/selectors';
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
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateImage')}</p>,
          label: t('authentication.noRightsUpdateImageLabel'),
        };
      }

      const { warning } = checkIsImageActionAllowed({
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
          label: t('image.form.notificationTitleCannotEdit'),
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

export default ImageAuthenticationNotification;
