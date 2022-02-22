import { StoreState } from '../../types';
import { ExpandedOrganizationsState } from './types';

export const expandedOrganizationsSelector = (
  state: StoreState
): ExpandedOrganizationsState => state.organizations.expandedOrganizations;
