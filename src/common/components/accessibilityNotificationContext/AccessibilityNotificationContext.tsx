import uniqueId from 'lodash/uniqueId';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  // Helper function to manage timeouts with automatic cleanup
  const addManagedTimeout = useCallback(
    (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(() => {
        callback();
        // Remove this timeout from the array after execution
        timeoutsRef.current = timeoutsRef.current.filter(
          (id) => id !== timeoutId
        );
      }, delay);
      timeoutsRef.current.push(timeoutId);
    },
    []
  );

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((items) =>
      items.filter(({ id }) => id !== notificationId)
    );
  }, []);

  const updateNotificationText = useCallback(
    (text: string, notificationId: string) =>
      setNotifications((items) =>
        items.map((notification) =>
          notification.id === notificationId
            ? { ...notification, text }
            : notification
        )
      ),
    []
  );

  const setAccessibilityText = useCallback(
    (text: string) => {
      const notificationId = uniqueId('accessibility-notification-');

      setNotifications((items) => [...items, { id: notificationId, text: '' }]);

      // Change notification text after 100ms to force screen reader to read it
      addManagedTimeout(() => {
        updateNotificationText(text, notificationId);
      }, 100);

      // Clear notification area after 1000ms
      addManagedTimeout(() => {
        removeNotification(notificationId);
      }, 1000);
    },
    [addManagedTimeout, updateNotificationText, removeNotification]
  );

  const value = useMemo(
    () => ({
      setAccessibilityText,
    }),
    [setAccessibilityText]
  );

  return (
    <AccessibilityNotificationContext.Provider value={value}>
      {notifications.map(({ text, id }) => (
        <div role="alert" key={id} className={styles.accessibilityNotification}>
          {text}
        </div>
      ))}

      {children}
    </AccessibilityNotificationContext.Provider>
  );
};
