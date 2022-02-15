import { createAction } from '@reduxjs/toolkit';

import { ORGANIZATIONS_ACTIONS } from './constants';

const addExpandedOrganization = createAction<string>(
  ORGANIZATIONS_ACTIONS.ADD_EXPANDED_ORGANIZATION
);

const removeExpandedOrganization = createAction<string>(
  ORGANIZATIONS_ACTIONS.REMOVE_EXPANDED_ORGANIZATION
);

export { addExpandedOrganization, removeExpandedOrganization };
