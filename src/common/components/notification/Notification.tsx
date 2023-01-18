import { ClassNames } from '@emotion/react';
import { Notification as BaseNotification, NotificationProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Notification: React.FC<NotificationProps> = ({
  className,
  type = 'success',
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <BaseNotification
          {...rest}
          className={cx(className, css(theme.notification.type?.[type]))}
          type={type}
        />
      )}
    </ClassNames>
  );
};

export default Notification;
