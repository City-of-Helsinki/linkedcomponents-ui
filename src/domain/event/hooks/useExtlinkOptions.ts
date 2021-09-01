import React from 'react';
import { useTranslation } from 'react-i18next';

import { EXTLINK } from '../../../constants';
import { OptionType } from '../../../types';

const useExtlinkOptions = (): OptionType[] => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(EXTLINK).map((type) => ({
        label: t(`event.${type.split('_').join('.')}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useExtlinkOptions;
