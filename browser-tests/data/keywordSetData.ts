/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { KeywordSetFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findKeywordSetsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('keyword_set/?'));

export const getKeywordSets = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<KeywordSetFieldsFragment[]> => {
  const keywordSetsResponse = await waitRequest({
    findFn: findKeywordSetsRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(keywordSetsResponse.response.body as string).data.map(
    (keywordSet) => normalizeKeys(keywordSet, normalizeKey)
  );
};
