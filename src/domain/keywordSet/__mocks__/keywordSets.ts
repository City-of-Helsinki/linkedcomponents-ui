import { MockedResponse } from '@apollo/client/testing';

import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import { KeywordSetDocument } from '../../../generated/graphql';
import generateAtId from '../../../utils/generateAtId';
import { fakeKeywords, fakeKeywordSet } from '../../../utils/mockDataUtils';

const audienceName = 'Audience name';
const audienceAtIds = [generateAtId('audience:1', 'keyword')];
const audience = fakeKeywords(
  audienceAtIds.length,
  audienceAtIds.map((atId) => ({ atId, name: { fi: audienceName } }))
);

const audienceKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.AUDIENCES,
  include: [INCLUDE.KEYWORDS],
};

const audienceKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.AUDIENCES,
  keywords: audience.data,
});

const audienceKeywordSetResponse = { data: { keywordSet: audienceKeywordSet } };

const mockedAudienceKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: audienceKeywordSetVariables,
  },
  result: audienceKeywordSetResponse,
};

const topicName = 'Keyword name';
const topicId = 'keyword:1';
const topicAtIds = [generateAtId(topicId, 'keyword')];

const topics = fakeKeywords(
  topicAtIds.length,
  topicAtIds.map((atId) => ({
    atId,
    id: topicId,
    name: { fi: topicName },
  }))
);

const topicsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.EVENT_TOPICS,
  keywords: topics.data,
});

const topicsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.EVENT_TOPICS,
  include: [INCLUDE.KEYWORDS],
};
const topicsKeywordSetResponse = { data: { keywordSet: topicsKeywordSet } };
const mockedTopicsKeywordSetResponse: MockedResponse = {
  request: { query: KeywordSetDocument, variables: topicsKeywordSetVariables },
  result: topicsKeywordSetResponse,
};

const educationModelsId = 'kasko:educationModels:1';
const educationModelsName = 'Education model 1';
const educationModelsAtIds = [generateAtId(educationModelsId, 'keyword')];
const educationModels = fakeKeywords(
  educationModelsAtIds.length,
  educationModelsAtIds.map((atId) => ({
    atId,
    id: educationModelsId,
    name: { fi: educationModelsName },
  }))
);
const educationModelsKeyword = educationModels.data[0];

const educationModelsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.EDUCATION_MODELS,
  keywords: educationModels.data,
});

const educationModelsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.EDUCATION_MODELS,
  include: [INCLUDE.KEYWORDS],
};
const educationModelsKeywordSetResponse = {
  data: { keywordSet: educationModelsKeywordSet },
};
const mockedEducationModelsKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: educationModelsKeywordSetVariables,
  },
  result: educationModelsKeywordSetResponse,
};

const educationLevelsId = 'kasko:educationLevels:1';
const educationLevelsName = 'Education level 1';
const educationLevelsAtIds = [generateAtId(educationLevelsId, 'keyword')];
const educationLevels = fakeKeywords(
  educationLevelsAtIds.length,
  educationLevelsAtIds.map((atId) => ({
    atId,
    id: educationLevelsId,
    name: { fi: educationLevelsName },
  }))
);
const educationLevelsKeyword = educationLevels.data[0];

const educationLevelsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.EDUCATION_LEVELS,
  keywords: educationLevels.data,
});

const educationLevelsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.EDUCATION_LEVELS,
  include: [INCLUDE.KEYWORDS],
};
const educationLevelsKeywordSetResponse = {
  data: { keywordSet: educationLevelsKeywordSet },
};
const mockedEducationLevelsKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: educationLevelsKeywordSetVariables,
  },
  result: educationLevelsKeywordSetResponse,
};

export {
  audience,
  audienceAtIds,
  educationLevelsKeyword,
  educationModelsKeyword,
  mockedAudienceKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  topicAtIds,
  topicName,
  topics,
};
