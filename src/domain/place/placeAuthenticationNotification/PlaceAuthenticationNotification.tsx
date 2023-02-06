import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { PLACE_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type PlaceAuthenticationNotificationProps = {
  action: PLACE_ACTIONS;
  className?: string;
  publisher: string;
};

const PlaceAuthenticationNotification: React.FC<
  PlaceAuthenticationNotificationProps
> = ({ action, className, publisher }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    /* istanbul ignore else */
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdatePlace')}</p>,
          label: t('authentication.noRightsUpdatePlaceLabel'),
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
          label: t('place.form.notificationTitleCannotEdit'),
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

export default PlaceAuthenticationNotification;
