/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { OrganizationFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

const findOrganizationsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('organization/?')) &&
  !r.request.url.includes('?child');

export const getOrganizations = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<OrganizationFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findOrganizationsRequest))
    .notEql(undefined, { timeout: 20000 });

  const organizationResponses = requestLogger.requests.filter(
    findOrganizationsRequest
  );

  return organizationResponses
    .reduce(
      (pre, cur) => pre.concat(JSON.parse(cur.response.body as string).data),
      []
    )
    .map((organization) => normalizeKeys(organization, normalizeKey));
};
