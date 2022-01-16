import { NotificationType } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Notification from '../../../common/components/notification/Notification';
import { signIn } from '../../auth/authenticate';
import { authenticatedSelector } from '../../auth/selectors';
import styles from './authenticationNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

export type AuthenticationNotificationProps = {
  label: string | null;
};

const AuthenticationNotification: React.FC<AuthenticationNotificationProps> = ({
  children,
  label,
}) => {
  const location = useLocation();
  const authenticated = useSelector(authenticatedSelector);
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  const notificationProps = {
    className: styles.authenticationNotification,
    closeAnimationDuration: 300,
    closeButtonLabelText: t('common.close') as string,
    dismissible: true,
    onClose: () => setHidden(true),
    style: hidden ? hiddenStyles : undefined,
    type: 'info' as NotificationType,
  };

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  if (!authenticated) {
    return (
      <Notification {...notificationProps} label={t('common.signIn')}>
        <p>
          {t('authenticationNotification.part1')}{' '}
          <button
            className={styles.button}
            onClick={handleSignIn}
            type="button"
          >
            {t('authenticationNotification.button')}
          </button>
          {t('authenticationNotification.part2')}
        </p>
      </Notification>
    );
  }

  if (!label) {
    return null;
  }

  return (
    <Notification {...notificationProps} label={label}>
      {children}
    </Notification>
  );
};

export default AuthenticationNotification;
