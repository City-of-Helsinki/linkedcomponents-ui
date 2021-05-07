import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import {
  KeywordSetQuery,
  useKeywordSetQuery,
  useLanguagesQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { keywordSetPathBuilder } from '../../keywordSet/utils';

type EventFieldOptionsDataState = {
  audienceData: KeywordSetQuery | undefined;
  loading: boolean;
  topicsData: KeywordSetQuery | undefined;
};

// Hook to get data for the languages, audience and keywords checkboxes
const useEventFieldOptionsData = (): EventFieldOptionsDataState => {
  const { loading: loadingLanguages } = useLanguagesQuery();

  const { data: topicsData, loading: loadingKeywords } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.TOPICS,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const { data: audienceData, loading: loadingAudiences } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.AUDIENCES,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const loading = loadingLanguages || loadingKeywords || loadingAudiences;
  return { audienceData, loading, topicsData };
};

export default useEventFieldOptionsData;
