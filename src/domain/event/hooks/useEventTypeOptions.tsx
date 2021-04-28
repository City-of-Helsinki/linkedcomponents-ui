import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventType } from '../../../generated/graphql';
import { OptionType } from '../../../types';

const useEventTypeOptions = () => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(EventType).map((type) => ({
        label: t(`event.type.${type}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useEventTypeOptions;
