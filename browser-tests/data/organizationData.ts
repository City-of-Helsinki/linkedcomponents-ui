/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import { OrganizationFieldsFragment } from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findOrganizationsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('organization/?')) &&
  !r.request.url.includes('?child');

export const getOrganizations = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<OrganizationFieldsFragment[]> => {
  await waitRequest({
    findFn: findOrganizationsRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

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
