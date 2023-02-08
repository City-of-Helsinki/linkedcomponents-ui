import classNames from 'classnames';
import { NotificationType } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Notification from '../../../common/components/notification/Notification';
import getValue from '../../../utils/getValue';
import { useAuth } from '../../auth/hooks/useAuth';
import styles from './authenticationNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

export type AuthenticationNotificationProps = {
  className?: string;
  label: string | null;
};

const AuthenticationNotification: React.FC<
  React.PropsWithChildren<AuthenticationNotificationProps>
> = ({ children, className, label }) => {
  const location = useLocation();
  const { isAuthenticated: authenticated } = useAuth();
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const { signIn } = useAuth();

  const notificationProps = {
    className: classNames(styles.authenticationNotification, className),
    closeAnimationDuration: 300,
    closeButtonLabelText: getValue(t('common.close'), ''),
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
