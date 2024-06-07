import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventStatus } from '../../../generated/graphql';
import { OptionType } from '../../../types';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';

const useEventStatusOptions = (): OptionType[] => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      sortBy(
        Object.values(EventStatus).map((status) => ({
          label: t(`event.eventStatus.${lowerCaseFirstLetter(status)}`),
          value: status,
        })),
        'label'
      ),
    [t]
  );

  return options;
};

export default useEventStatusOptions;
