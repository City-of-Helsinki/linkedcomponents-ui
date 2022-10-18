import { useMemo, useReducer } from 'react';

import { expandedOrganizationsInitialState } from '../constants';
import { reducers } from '../reducers';
import { OrganizationsPageSettingsState } from '../types';
import {
  addExpandedOrganization as addExpandedOrganizationFn,
  removeExpandedOrganization as removeExpandedOrganizationFn,
} from '../utils';

const useOrganizationsPageSettings = (): OrganizationsPageSettingsState => {
  const [expandedOrganizations, dispatchExpandedOrganizationsState] =
    useReducer(
      reducers.expandedOrganizationsReducer,
      expandedOrganizationsInitialState
    );

  const actions = useMemo(() => {
    return {
      addExpandedOrganization: (id: string) =>
        addExpandedOrganizationFn({ dispatchExpandedOrganizationsState, id }),
      removeExpandedOrganization: (id: string) =>
        removeExpandedOrganizationFn({
          dispatchExpandedOrganizationsState,
          id,
        }),
    };
  }, []);

  return { expandedOrganizations, ...actions };
};

export default useOrganizationsPageSettings;
