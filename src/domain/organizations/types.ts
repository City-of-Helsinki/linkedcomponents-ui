import {
  ExpandedOrganizationsActionTypes,
  ORGANIZATION_SEARCH_PARAMS,
  ORGANIZATION_SORT_OPTIONS,
} from './constants';

export type OrganizationSearchParams = {
  [ORGANIZATION_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [ORGANIZATION_SEARCH_PARAMS.SORT]?: ORGANIZATION_SORT_OPTIONS | null;
  [ORGANIZATION_SEARCH_PARAMS.TEXT]?: string;
};

export type OrganizationSearchInitialValues = {
  [ORGANIZATION_SEARCH_PARAMS.SORT]: ORGANIZATION_SORT_OPTIONS;
  [ORGANIZATION_SEARCH_PARAMS.TEXT]: string;
};

export type OrganizationSearchParam = keyof OrganizationSearchParams;

export type OrganizationsLocationState = {
  organizationId: string;
};

export type ExpandedOrganizationsState = string[];

export interface ExpandedOrganizationsAction {
  type: ExpandedOrganizationsActionTypes;
  payload: string;
}

export type OrganizationsPageSettings = {
  expandedOrganizations: ExpandedOrganizationsState;
};

export interface OrganizationsActions {
  addExpandedOrganization: (id: string) => void;
  removeExpandedOrganization: (id: string) => void;
}

export type OrganizationsPageSettingsState = OrganizationsPageSettings &
  OrganizationsActions;
