import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { NOTIFICATIONS } from '../constants';

const useNotificationOptions = (): OptionType[] => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(NOTIFICATIONS)
        // TODO: At the moment only email messages are supported in API. So hide SMS option
        .filter((t) => t === NOTIFICATIONS.EMAIL)
        .map((type) => ({
          label: t(`signup.notifications.${type}`),
          value: type,
        })),
    [t]
  );

  return options;
};

export default useNotificationOptions;
