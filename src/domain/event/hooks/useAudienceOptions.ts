import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { getKeywordOption } from '../../keywordSet/utils';
import useEventFieldOptionsData from './useEventFieldOptionsData';
import { sortAudienceOptions } from './utils';

const useAudienceOptions = (): OptionType[] => {
  const locale = useLocale();

  const { audienceData } = useEventFieldOptionsData();

  const audienceOptions =
    audienceData?.keywordSet?.keywords
      ?.map((keyword) => getKeywordOption({ keyword, locale }))
      .sort(sortAudienceOptions) || [];

  return audienceOptions;
};

export default useAudienceOptions;
