import { ClassNames } from '@emotion/react';
import {
  Notification as BaseNotification,
  NotificationProps,
  NotificationSizeToast,
} from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Notification: React.FC<NotificationProps> = ({
  className,
  size = 'default',
  type = 'success',
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <BaseNotification
          {...rest}
          className={cx(
            className,
            css(theme.notification.type?.[type]),
            css(theme.notification.size?.[size])
          )}
          size={size as NotificationSizeToast}
          type={type}
        />
      )}
    </ClassNames>
  );
};

export default Notification;
