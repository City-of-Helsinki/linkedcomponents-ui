import range from 'lodash/range';

import { INCLUDE, KEYWORD_SETS } from '../../../../../constants';
import { KeywordSetDocument } from '../../../../../generated/graphql';
import {
  fakeKeywords,
  fakeKeywordSet,
} from '../../../../../utils/mockDataUtils';

const audienceNames = range(1, 16).map((index) => `Audience ${index}`);
const audiences = fakeKeywords(
  audienceNames.length,
  audienceNames.map((name) => ({ name: { fi: name } }))
).data;

const audiencesKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.AUDIENCES,
  keywords: audiences,
});

const audiencesKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.AUDIENCES,
  include: [INCLUDE.KEYWORDS],
};
const audiencesKeywordSetResponse = {
  data: { keywordSet: audiencesKeywordSet },
};

const mockedAudiencesKeywordSetResponse = {
  request: {
    query: KeywordSetDocument,
    variables: audiencesKeywordSetVariables,
  },
  result: audiencesKeywordSetResponse,
};

export { audienceNames, mockedAudiencesKeywordSetResponse };
