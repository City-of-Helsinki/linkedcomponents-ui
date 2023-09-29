/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  NotificationsContext,
  NotificationsContextProps,
} from '../NotificationsContext';

export const useNotificationsContext = (): NotificationsContextProps => {
  const context = useContext<NotificationsContextProps | undefined>(
    NotificationsContext
  );

  /* istanbul ignore next */
  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'NotificationsContext context is undefined, please verify you are calling useNotificationsContext() as child of a <NotificationsProvider> component.'
    );
  }

  return context;
};
