/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { KeywordSetFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

const findKeywordSetsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('keyword_set/?'));

export const getKeywordSets = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<KeywordSetFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findKeywordSetsRequest))
    .notEql(undefined, { timeout: 20000 });
  const keywordSetsResponse = requestLogger.requests.find(
    findKeywordSetsRequest
  );

  return JSON.parse(keywordSetsResponse.response.body as string).data.map(
    (keywordSet) => normalizeKeys(keywordSet, normalizeKey)
  );
};
