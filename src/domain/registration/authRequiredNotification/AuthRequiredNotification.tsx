import { NotificationType } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import Notification from '../../../common/components/notification/Notification';
import { signIn } from '../../auth/authenticate';
import { authenticatedSelector } from '../../auth/selectors';
import styles from './authRequiredNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

const AuthRequiredNotification: React.FC = () => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const authenticated = useSelector(authenticatedSelector);

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
    return null;
  }

  // TODO: Show warning also if user doesn't have any organizations
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
