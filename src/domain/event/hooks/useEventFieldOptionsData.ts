import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import {
  KeywordSetQuery,
  useKeywordSetQuery,
  useLanguagesQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { keywordSetPathBuilder } from '../../keywordSet/utils';
import { languagesPathBuilder } from '../../language/utils';
import { EVENT_TYPE } from '../constants';

type EventFieldOptionsDataState = {
  audienceData?: KeywordSetQuery;
  educationLevelsData?: KeywordSetQuery;
  educationModelsData?: KeywordSetQuery;
  loading: boolean;
  topicsData?: KeywordSetQuery;
};

// Hook to get data for the languages, audience and keywords checkboxes
const useEventFieldOptionsData = (
  eventType?: EVENT_TYPE
): EventFieldOptionsDataState => {
  const { loading: loadingLanguages } = useLanguagesQuery({
    variables: { createPath: getPathBuilder(languagesPathBuilder) },
  });

  const { data: topicsData, loading: loadingKeywords } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id:
        eventType === EVENT_TYPE.Course
          ? KEYWORD_SETS.COURSE_TOPICS
          : KEYWORD_SETS.EVENT_TOPICS,
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

  const { data: educationModelsData, loading: loadingEducationModels } =
    useKeywordSetQuery({
      variables: {
        createPath: getPathBuilder(keywordSetPathBuilder),
        id: KEYWORD_SETS.EDUCATION_MODELS,
        include: [INCLUDE.KEYWORDS],
      },
    });

  const { data: educationLevelsData, loading: loadingEducationLevels } =
    useKeywordSetQuery({
      variables: {
        createPath: getPathBuilder(keywordSetPathBuilder),
        id: KEYWORD_SETS.EDUCATION_LEVELS,
        include: [INCLUDE.KEYWORDS],
      },
    });

  const loading =
    loadingLanguages ||
    loadingKeywords ||
    loadingAudiences ||
    loadingEducationModels ||
    loadingEducationLevels;
  return {
    audienceData,
    educationLevelsData,
    educationModelsData,
    loading,
    topicsData,
  };
};

export default useEventFieldOptionsData;
