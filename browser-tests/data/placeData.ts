/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { PlaceFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

const findPlacesRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('place/?'));

export const getPlaces = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<PlaceFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findPlacesRequest))
    .notEql(undefined, { timeout: 20000 });
  const placesResponse = requestLogger.requests.find(findPlacesRequest);

  return JSON.parse(placesResponse.response.body as string).data.map((place) =>
    normalizeKeys(place, normalizeKey)
  );
};
