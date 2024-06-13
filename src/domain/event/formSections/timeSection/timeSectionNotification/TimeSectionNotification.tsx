import React from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../../common/components/notification/Notification';
import styles from '../../../eventPage.module.scss';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import TimeInstructions from '../timeInstructions/TimeInstructions';

const TimeSectionNotification: React.FC = () => {
  const { t } = useTranslation();
  const { eventType } = useTimeSectionContext();

  return (
    <Notification
      className={styles.notificationForTitle}
      label={t(`event.form.notificationTitleEventTimes.${eventType}`)}
      type="info"
    >
      <TimeInstructions eventType={eventType} />
    </Notification>
  );
};

export default TimeSectionNotification;
