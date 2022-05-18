/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { PlaceFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findPlacesRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('place/?'));

export const getPlaces = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<PlaceFieldsFragment[]> => {
  const placesResponse = await waitRequest({
    findFn: findPlacesRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(placesResponse.response.body as string).data.map((place) =>
    normalizeKeys(place, normalizeKey)
  );
};
