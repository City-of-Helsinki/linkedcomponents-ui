import { ClassNames } from '@emotion/react';
import {
  Notification as BaseNotification,
  NotificationProps,
  NotificationSizeToast,
} from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './notification.module.scss';

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
            styles[`size${capitalize(size)}`]
          )}
          size={size as NotificationSizeToast}
          type={type}
        />
      )}
    </ClassNames>
  );
};

export default Notification;
