/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { KeywordFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findKeywordsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('keyword/?'));

export const getKeywords = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<KeywordFieldsFragment[]> => {
  const keywordsResponse = await waitRequest({
    findFn: findKeywordsRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(keywordsResponse.response.body.toString()).data.map(
    (keyword) => normalizeKeys(keyword, normalizeKey)
  );
};
