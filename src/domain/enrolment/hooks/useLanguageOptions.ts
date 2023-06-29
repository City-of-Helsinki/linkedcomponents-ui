import React from 'react';

import {
  LanguageFieldsFragment,
  LanguagesQueryVariables,
  useLanguagesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import {
  getLanguageOption,
  languagesPathBuilder,
  sortLanguageOptions,
} from '../../language/utils';

const useLanguageOptions = (
  variables?: LanguagesQueryVariables
): OptionType[] => {
  const locale = useLocale();

  const { data } = useLanguagesQuery({
    variables: {
      ...variables,
      createPath: getPathBuilder(languagesPathBuilder),
    },
  });

  const languageOptions = React.useMemo(() => {
    return getValue(
      data?.languages.data
        ?.map((language) =>
          getLanguageOption(language as LanguageFieldsFragment, locale)
        )
        .sort(sortLanguageOptions),
      []
    );
  }, [data, locale]);

  return languageOptions;
};

export default useLanguageOptions;
