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

export {
  audience,
  audienceAtIds,
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  topicAtIds,
  topics,
};
