import React from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../../common/components/notification/Notification';
import TimeSectionContext from '../TimeSectionContext';

const TimeSectionNotification: React.FC = () => {
  const { t } = useTranslation();
  const { eventType } = React.useContext(TimeSectionContext);

  return (
    <Notification
      label={t(`event.form.notificationTitleEventTimes.${eventType}`)}
      type="info"
    >
      <p>{t(`event.form.infoTextEventTimes1.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes2.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes3.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes4.${eventType}`)}</p>
      <p>{t(`event.form.infoTextEventTimes5`)}</p>
    </Notification>
  );
};

export default TimeSectionNotification;
