/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { ImageFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findImagesRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('image/?'));

export const getImages = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<ImageFieldsFragment[]> => {
  const imagesResponse = await waitRequest({
    findFn: findImagesRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(imagesResponse.response.body as string).data.map((image) =>
    normalizeKeys(image, normalizeKey)
  );
};
