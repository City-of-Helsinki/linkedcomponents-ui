import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { NOTIFICATIONS } from '../constants';

const useNotificationOptions = (): OptionType[] => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(NOTIFICATIONS).map((type) => ({
        label: t(`enrolment.notifications.${type}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useNotificationOptions;
