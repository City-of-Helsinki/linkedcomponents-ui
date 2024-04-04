import uniqueId from 'lodash/uniqueId';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import styles from './accessibilityNotification.module.scss';

export type SetAccessibilityTextFn = (text: string) => void;

export type AccessibilityNotificationProps = { id: string; text: string };

export type AccessibilityNotificationContextProps = {
  setAccessibilityText: SetAccessibilityTextFn;
};

export const AccessibilityNotificationContext = createContext<
  AccessibilityNotificationContextProps | undefined
>(undefined);

export const AccessibilityNotificationProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    AccessibilityNotificationProps[]
  >([]);

  const removeNotification = (notificationId: string) => {
    setNotifications((items) =>
      items.filter(({ id }) => id !== notificationId)
    );
  };

  const updateNotificationText = (text: string, notificationId: string) =>
    setNotifications((items) =>
      items.map((notification) =>
        notification.id === notificationId
          ? { ...notification, text }
          : notification
      )
    );

  const setAccessibilityText = useCallback((text: string) => {
    const notificationId = uniqueId('accessibility-notification-');

    setNotifications((items) => [...items, { id: notificationId, text: '' }]);
    // Change notification text after 100ms to force screen reader
    // to read the notification
    setTimeout(() => {
      updateNotificationText(text, notificationId);
    }, 100);

    // Clear notification area after 1000ms
    setTimeout(() => {
      removeNotification(notificationId);
    }, 1000);
  }, []);

  const value = useMemo(
    () => ({
      setAccessibilityText,
    }),
    [setAccessibilityText]
  );

  return (
    <AccessibilityNotificationContext.Provider value={value}>
      {notifications.map(({ text, id }) => (
        <output key={id} className={styles.accessibilityNotification}>
          {text}
        </output>
      ))}

      {children}
    </AccessibilityNotificationContext.Provider>
  );
};
