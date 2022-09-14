import { ExpandedOrganizationsState, OrganizationsPageSettings } from './types';

export enum ORGANIZATION_SORT_OPTIONS {
  CLASSIFICATION = 'classification',
  CLASSIFICATION_DESC = '-classification',
  DATA_SOURCE = 'dataSource',
  DATA_SOURCE_DESC = '-dataSource',
  ID = 'id',
  ID_DESC = '-id',
  NAME = 'name',
  NAME_DESC = '-name',
  PARENT_ORGANIZATION = 'parentOrganization',
  PARENT_ORGANIZATION_DESC = '-parentOrganization',
}

export const DEFAULT_ORGANIZATION_SORT = ORGANIZATION_SORT_OPTIONS.NAME;

export enum ORGANIZATION_SEARCH_PARAMS {
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const ORGANIZATIONS_ACTIONS = {};

export enum ExpandedOrganizationsActionTypes {
  ADD_EXPANDED_ORGANIZATION = 'ADD_EXPANDED_ORGANIZATION',
  REMOVE_EXPANDED_ORGANIZATION = 'REMOVE_EXPANDED_ORGANIZATION',
}

export const expandedOrganizationsInitialState: ExpandedOrganizationsState = [];

export const organizationsReducerInitialState: OrganizationsPageSettings = {
  expandedOrganizations: expandedOrganizationsInitialState,
};
