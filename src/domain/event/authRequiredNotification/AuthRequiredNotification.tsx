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

  if (authenticated) return null;

  return (
    <Notification
      className={styles.authRequiredNotification}
      closeAnimationDuration={300}
      closeButtonLabelText={t('common.close') as string}
      dismissible
      label={t('common.signIn')}
      onClose={() => setHidden(true)}
      style={hidden ? hiddenStyles : undefined}
      type="info"
    >
      <p>
        {t('authRequiredNotification.part1')}{' '}
        <button className={styles.button} onClick={handleSignIn}>
          {t('authRequiredNotification.button')}
        </button>
        {t('authRequiredNotification.part2')}
      </p>
    </Notification>
  );
};

export default AuthRequiredNotification;
