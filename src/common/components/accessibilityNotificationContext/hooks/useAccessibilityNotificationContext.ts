/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  AccessibilityNotificationContext,
  AccessibilityNotificationContextProps,
} from '../AccessibilityNotificationContext';

export const useAccessibilityNotificationContext =
  (): AccessibilityNotificationContextProps => {
    const context = useContext<
      AccessibilityNotificationContextProps | undefined
    >(AccessibilityNotificationContext);

    /* istanbul ignore next */
    if (!context) {
      throw new Error(
        // eslint-disable-next-line max-len
        'AccessibilityNotificationContext context is undefined, please verify you are calling useAccessibilityNotificationContext() as child of a <AccessibilityNotificationProvider> component.'
      );
    }

    return context;
  };
