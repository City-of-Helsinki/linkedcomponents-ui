import { NotificationType } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import Notification from '../../../common/components/notification/Notification';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { signIn } from '../../auth/authenticate';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import useRegistrationPublisher from '../hooks/useRegistrationPublisher';
import { checkIsEditActionAllowed } from '../utils';
import styles from './authRequiredNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

export type AuthRequiredNotificationProps = {
  registration?: RegistrationFieldsFragment;
};

const AuthRequiredNotification: React.FC<AuthRequiredNotificationProps> = ({
  registration,
}) => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const publisher = useRegistrationPublisher({ registration }) as string;
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  const notificationProps = {
    className: styles.authRequiredNotification,
    closeAnimationDuration: 300,
    closeButtonLabelText: t('common.close') as string,
    dismissible: true,
    onClose: () => setHidden(true),
    style: hidden ? hiddenStyles : undefined,
    type: 'info' as NotificationType,
  };

  if (authenticated) {
    if (!adminOrganizations.length) {
      return (
        <Notification
          {...notificationProps}
          label={t('authentication.noRightsUpdateRegistrationLabel')}
        >
          <p>{t('authentication.noRightsUpdateRegistration')}</p>
        </Notification>
      );
    }

    if (registration) {
      const action = REGISTRATION_EDIT_ACTIONS.UPDATE;
      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        organizationAncestors,
        publisher,
        t,
        user,
      });

      if (warning) {
        return (
          <Notification
            {...notificationProps}
            label={t('registration.form.notificationTitleCannotEdit')}
          >
            <p>{warning}</p>
          </Notification>
        );
      }
    }

    return null;
  }

  return (
    <Notification {...notificationProps} label={t('common.signIn')}>
      <p>
        {t('authRequiredNotification.part1')}{' '}
        <button className={styles.button} onClick={handleSignIn} type="button">
          {t('authRequiredNotification.button')}
        </button>
        {t('authRequiredNotification.part2')}
      </p>
    </Notification>
  );
};

export default AuthRequiredNotification;
