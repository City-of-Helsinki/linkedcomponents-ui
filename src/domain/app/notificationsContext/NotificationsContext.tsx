import uniqueId from 'lodash/uniqueId';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import Notification, {
  NotificationProps,
} from '../../../common/components/notification/Notification';

export type NotificationsContextProps = {
  addNotification: (props: NotificationProps) => void;
};

export const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

export const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const value = useMemo<NotificationsContextProps>(() => {
    return {
      addNotification: (props: NotificationProps) =>
        setNotifications((items) => [
          ...items,
          { ...props, id: uniqueId('notification-') },
        ]),
    };
  }, [setNotifications]);

  return (
    <NotificationsContext.Provider value={value}>
      {notifications.map((props, index) => {
        const removeNotification = () =>
          setNotifications((items) => items.filter((i) => i.id !== props.id));
        const getNotificationStyle = (): React.CSSProperties => {
          const offset = 32;
          let topMargin = offset;

          for (let i = 0; i < index; i = i + 1) {
            topMargin +=
              (document.getElementById(notifications[i].id as string)
                ?.children[0]?.clientHeight ?? 0) + offset;
          }

          return {
            top: topMargin,
            transform: 'translate3d(0px, 0px, 0px)',
            zIndex: 1000,
          };
        };
        return (
          <Notification
            notificationAriaLabel={
              typeof props.label === 'string' ? props.label : undefined
            }
            {...props}
            style={getNotificationStyle()}
            key={props.id}
            size="default"
            position="top-right"
            autoClose={true}
            onClose={removeNotification}
          />
        );
      })}
      {children}
    </NotificationsContext.Provider>
  );
};
