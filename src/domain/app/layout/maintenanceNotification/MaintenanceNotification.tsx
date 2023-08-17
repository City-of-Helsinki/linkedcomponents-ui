import { Notification } from 'hds-react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './maintenanceNotification.module.scss';

const MaintenanceNotification: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Notification
        dataTestId="maintenance-notification"
        className={styles.notification}
        label={t('maintenance.header.label')}
      >
        {t('maintenance.header.text')}
      </Notification>
    </div>
  );
};

export default MaintenanceNotification;
