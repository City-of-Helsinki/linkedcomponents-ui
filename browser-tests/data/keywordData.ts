/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { KeywordFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

const findKeywordsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('keyword/?'));

export const getKeywords = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<KeywordFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findKeywordsRequest))
    .notEql(undefined, { timeout: 20000 });
  const keywordsResponse = requestLogger.requests.find(findKeywordsRequest);

  return JSON.parse(keywordsResponse.response.body as string).data.map(
    (keyword) => normalizeKeys(keyword, normalizeKey)
  );
};
