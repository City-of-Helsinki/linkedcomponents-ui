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
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t('place.form.notificationTitleCannotEdit')}
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
      className={className}
      noRequiredOrganizationLabel={t('authentication.noRightsUpdatePlaceLabel')}
      noRequiredOrganizationText={t('authentication.noRightsUpdatePlace')}
    />
  );
};

export default PlaceAuthenticationNotification;
