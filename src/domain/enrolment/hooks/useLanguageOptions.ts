import React from 'react';

import {
  LanguageFieldsFragment,
  useLanguagesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { getLanguageOption, sortLanguageOptions } from '../../language/utils';

const useLanguageOptions = (): OptionType[] => {
  const locale = useLocale();

  const { data } = useLanguagesQuery();

  const languageOptions = React.useMemo(() => {
    return (
      data?.languages.data
        ?.map((language) =>
          getLanguageOption(language as LanguageFieldsFragment, locale)
        )
        .sort(sortLanguageOptions) || []
    );
  }, [data, locale]);

  return languageOptions;
};

export default useLanguageOptions;
