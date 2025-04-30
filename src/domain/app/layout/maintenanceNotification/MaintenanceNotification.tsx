import { Notification } from 'hds-react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import styles from './maintenanceNotification.module.scss';

const MaintenanceNotification: FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

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
              url: `/${locale}${ROUTES.INSTRUCTIONS_REGISTRATION}`,
            }),
          }}
        ></div>
      </Notification>
    </div>
  );
};

export default MaintenanceNotification;
