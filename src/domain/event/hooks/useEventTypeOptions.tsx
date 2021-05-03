import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { EVENT_TYPE } from '../constants';

const useEventTypeOptions = () => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(EVENT_TYPE).map((type) => ({
        label: t(`event.type.${type}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useEventTypeOptions;
