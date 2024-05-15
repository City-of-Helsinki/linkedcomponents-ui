import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { getOrganizationOption } from '../utils';
import useAllOrganizations from './useAllOrganizations';

export type useOrganizationOptionsState = {
  loading: boolean;
  options: OptionType[];
};

const useOrganizationOptions = (
  idPath: 'atId' | 'id' = 'id'
): useOrganizationOptionsState => {
  const locale = useLocale();
  const { loading, organizations } = useAllOrganizations();
  const { t } = useTranslation();

  return {
    loading,
    options: sortBy(
      organizations.map((o) =>
        getOrganizationOption({ idPath, locale, organization: o, t })
      ),
      'label'
    ),
  };
};

export default useOrganizationOptions;
