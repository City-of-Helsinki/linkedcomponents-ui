import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { ORGANIZATION_INTERNAL_TYPE } from '../constants';

const useOrganizationInternalTypeOptions = (): OptionType[] => {
  const { t } = useTranslation();

  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(ORGANIZATION_INTERNAL_TYPE).map((type) => ({
        label: t(`organization.internalType.${type}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useOrganizationInternalTypeOptions;
