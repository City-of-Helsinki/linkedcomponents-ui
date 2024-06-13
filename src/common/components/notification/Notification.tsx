import { ClassNames } from '@emotion/react';
import {
  Notification as HdsNotification,
  NotificationProps as HdsNotificationProps,
} from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './notification.module.scss';

export type NotificationProps = { id?: string } & HdsNotificationProps;

const Notification: React.FC<NotificationProps> = ({
  className,
  id,
  label,
  notificationAriaLabel,
  type = 'success',
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div id={id}>
          <HdsNotification
            {...rest}
            className={cx(
              styles.notification,
              className,
              css(theme.notification.type?.[type])
            )}
            label={label}
            notificationAriaLabel={
              /* istanbul ignore next */
              typeof label === 'string'
                ? label ?? notificationAriaLabel
                : notificationAriaLabel
            }
            type={type}
          />
        </div>
      )}
    </ClassNames>
  );
};

export default Notification;
