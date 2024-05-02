import React from 'react';
import { useTranslation } from 'react-i18next';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { PRICE_GROUP_ACTIONS } from '../constants';
import { checkIsEditPriceGroupActionAllowed } from '../utils';

export type PriceGroupAuthenticationNotificationProps = {
  action: PRICE_GROUP_ACTIONS;
  className?: string;
  publisher: string;
};

const PriceGroupAuthenticationNotification: React.FC<
  PriceGroupAuthenticationNotificationProps
> = ({ action, className, publisher }) => {
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  return (
    <AuthenticationNotification
      authorizationWarningLabel={t(
        'priceGroup.form.notificationTitleCannotEdit'
      )}
      getAuthorizationWarning={() =>
        checkIsEditPriceGroupActionAllowed({
          action,
          authenticated,
          organizationAncestors,
          publisher,
          t,
          user,
        })
      }
      className={className}
      noRequiredOrganizationLabel={t(
        'authentication.noRightsUpdatePriceGroupLabel'
      )}
      noRequiredOrganizationText={t('authentication.noRightsUpdatePriceGroup')}
      requiredOrganizationType={['financialAdmin', 'superUser']}
    />
  );
};

export default PriceGroupAuthenticationNotification;
