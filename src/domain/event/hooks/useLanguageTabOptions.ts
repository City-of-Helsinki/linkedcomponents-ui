import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TabOptionType } from '../../../common/components/tabs/Tabs';
import { LE_DATA_LANGUAGES } from '../../../constants';
import useSortedInfoLanguages from './useSortedInfoLanguages';

type UseLanguageTabOptionsState = TabOptionType[];

const useLanguageTabOptions = (
  languages: LE_DATA_LANGUAGES[],
  isCompletedFn: (lang: LE_DATA_LANGUAGES) => boolean
): UseLanguageTabOptionsState => {
  const { t } = useTranslation();

  const sortedEventInfoLanguages = useSortedInfoLanguages(languages);

  const languageOptions = useMemo(
    () =>
      sortedEventInfoLanguages.map((language) => {
        return {
          isCompleted: isCompletedFn(language),
          label: t(`form.language.${language}`),
          value: language,
        };
      }),
    [isCompletedFn, sortedEventInfoLanguages, t]
  );

  return languageOptions;
};

export default useLanguageTabOptions;
