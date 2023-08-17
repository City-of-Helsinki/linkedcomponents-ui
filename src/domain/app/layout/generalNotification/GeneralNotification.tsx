import { Notification } from 'hds-react';
import React, { FC } from 'react';

import styles from './generalNotification.module.scss';

const GeneralNotification: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Notification
        className={styles.notification}
        label="Palvelua päivitetään"
      >
        Keskiviikkona 23.8. Linked Events -palvelua päivitetään. Kyseisenä
        päivänä sisällöntuotanto tai kirjautuminen ei ole mahdollista.
      </Notification>
    </div>
  );
};

export default GeneralNotification;
