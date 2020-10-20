import {
  Notification as BaseNotification,
  NotificationProps,
} from 'hds-react/components/Notification';
import React from 'react';

const Notification: React.FC<NotificationProps> = (props) => {
  return <BaseNotification {...props} />;
};

export default Notification;
