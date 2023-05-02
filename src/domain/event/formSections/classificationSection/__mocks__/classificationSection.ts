import range from 'lodash/range';

import { INCLUDE, KEYWORD_SETS } from '../../../../../constants';
import {
  KeywordDocument,
  KeywordsDocument,
  KeywordSetDocument,
} from '../../../../../generated/graphql';
import {
  fakeKeywords,
  fakeKeywordSet,
} from '../../../../../utils/mockDataUtils';
import {
  REMOTE_PARTICIPATION_KEYWORD,
  REMOTE_PARTICIPATION_KEYWORD_ID,
} from '../../../../keyword/constants';

const courseTopicNames = range(1, 5).map((index) => `Course keyword ${index}`);
const courseTopics = fakeKeywords(
  courseTopicNames.length,
  courseTopicNames.map((name, index) => ({
    id: `${index + 1}`,
    name: { fi: name },
  }))
);
const courseTopicsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.COURSE_TOPICS,
  keywords: courseTopics.data,
});
const courseTopicsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.COURSE_TOPICS,
  include: [INCLUDE.KEYWORDS],
};
const courseTopicsKeywordSetResponse = {
  data: { keywordSet: courseTopicsKeywordSet },
};
const mockedCourseTopicsKeywordSetResponse = {
  request: {
    query: KeywordSetDocument,
    variables: courseTopicsKeywordSetVariables,
  },
  result: courseTopicsKeywordSetResponse,
};

const removeParticipationName = 'Etäosallistuminen';

const eventTopicNames = range(1, 16).map((index) => `Keyword ${index}`);
const eventTopics = fakeKeywords(eventTopicNames.length + 1, [
  {
    id: REMOTE_PARTICIPATION_KEYWORD_ID,
    atId: REMOTE_PARTICIPATION_KEYWORD,
    name: { fi: removeParticipationName },
  },
  ...eventTopicNames.map((name, index) => ({
    id: `${index + 1}`,
    name: { fi: name },
  })),
]);

const eventTopicsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.EVENT_TOPICS,
  keywords: eventTopics.data,
});
const eventTopicsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.EVENT_TOPICS,
  include: [INCLUDE.KEYWORDS],
};
const eventTopicsKeywordSetResponse = {
  data: { keywordSet: eventTopicsKeywordSet },
};
const mockedEventTopicsKeywordSetResponse = {
  request: {
    query: KeywordSetDocument,
    variables: eventTopicsKeywordSetVariables,
  },
  result: eventTopicsKeywordSetResponse,
};

const keywordsVariables = {
  createPath: undefined,
  dataSource: ['yso', 'helsinki'],
  showAllKeywords: true,
  freeText: '',
};
const keywordsResponse = { data: { keywords: eventTopics } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

const keyword = eventTopics.data[0];
const keywordVariables = { id: keyword?.id, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse = {
  request: { query: KeywordDocument, variables: keywordVariables },
  result: keywordResponse,
};
export {
  courseTopicNames,
  eventTopicNames,
  keyword,
  mockedCourseTopicsKeywordSetResponse,
  mockedEventTopicsKeywordSetResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  removeParticipationName,
};
