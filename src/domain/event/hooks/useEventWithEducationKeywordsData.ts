import {
  EventFieldsFragment,
  EventQuery,
  KeywordFieldsFragment,
  KeywordSetQuery,
} from '../../../generated/graphql';
import skipFalsyType from '../../../utils/skipFalsyType';
import useEventFieldOptionsData from './useEventFieldOptionsData';

const isEducationKeyword = (
  keyword: KeywordFieldsFragment,
  educationData: KeywordSetQuery | undefined
) =>
  educationData?.keywordSet?.keywords?.some(
    (educationKeyword) => educationKeyword?.atId === keyword.atId
  );

const getKeywords = (
  keywords: Array<KeywordFieldsFragment | null>,
  educationModelsData: KeywordSetQuery | undefined,
  educationLevelsData: KeywordSetQuery | undefined
) =>
  keywords
    .filter(skipFalsyType)
    .filter((keyword) => !isEducationKeyword(keyword, educationModelsData))
    .filter((keyword) => !isEducationKeyword(keyword, educationLevelsData));

const getEducationKeywords = (
  keywords: Array<KeywordFieldsFragment | null>,
  educationData: KeywordSetQuery | undefined
) =>
  keywords
    .filter(skipFalsyType)
    .filter((keyword) => isEducationKeyword(keyword, educationData));

const useEventWithEducationKeywordsData = (
  eventData: EventQuery | undefined
): EventFieldsFragment | undefined => {
  const { educationLevelsData, educationModelsData } =
    useEventFieldOptionsData();

  if (!eventData?.event) {
    return eventData?.event;
  }

  return {
    ...eventData?.event,
    educationLevelsKeywords: getEducationKeywords(
      eventData.event.keywords,
      educationLevelsData
    ),
    educationModelsKeywords: getEducationKeywords(
      eventData.event.keywords,
      educationModelsData
    ),
    keywords: getKeywords(
      eventData.event.keywords,
      educationModelsData,
      educationLevelsData
    ),
  };
};

export default useEventWithEducationKeywordsData;
