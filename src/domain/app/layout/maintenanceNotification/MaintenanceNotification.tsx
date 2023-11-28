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
        <div
          dangerouslySetInnerHTML={{
            __html: t('maintenance.header.text', {
              openInNewTab: t('common.openInNewTab'),
              url: '/Linked%20Registration%20-ohje.pdf',
            }),
          }}
        ></div>
      </Notification>
    </div>
  );
};

export default MaintenanceNotification;
