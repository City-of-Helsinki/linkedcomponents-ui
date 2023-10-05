import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { OrganizationFormFields } from './types';

export const TEST_PUBLISHER_ID = 'publisher:1';
export const EXTERNAL_PUBLISHER_ID = 'others';

export const MAX_OGRANIZATIONS_PAGE_SIZE = 1000;

export enum ORGANIZATION_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
}

export const ORGANIZATION_ACTION_ICONS = {
  [ORGANIZATION_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [ORGANIZATION_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [ORGANIZATION_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [ORGANIZATION_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const ORGANIZATION_ACTION_LABEL_KEYS = {
  [ORGANIZATION_ACTIONS.CREATE]: 'common.save',
  [ORGANIZATION_ACTIONS.DELETE]: 'organization.form.buttonDelete',
  [ORGANIZATION_ACTIONS.EDIT]: 'organizationsPage.actionButtons.edit',
  [ORGANIZATION_ACTIONS.UPDATE]: 'common.save',
};

export enum ORGANIZATION_FIELDS {
  ADMIN_USERS = 'adminUsers',
  AFFILIATED_ORGANIZATIONS = 'affiliatedOrganizations',
  CLASSIFICATION = 'classification',
  DATA_SOURCE = 'dataSource',
  DISSOLUTION_DATE = 'dissolutionDate',
  FOUNDING_DATE = 'foundingDate',
  ID = 'id',
  INTERNAL_TYPE = 'internalType',
  NAME = 'name',
  ORIGIN_ID = 'originId',
  PARENT_ORGANIZATION = 'parentOrganization',
  REGISTRATION_ADMIN_USERS = 'registrationAdminUsers',
  REGULAR_USERS = 'regularUsers',
  REPLACED_BY = 'replacedBy',
  SUB_ORGANIZATIONS = 'subOrganizations',
}

export enum ORGANIZATION_INTERNAL_TYPE {
  NORMAL = 'normal',
  AFFILIATED = 'affiliated',
}

export const ORGANIZATION_INITIAL_VALUES: OrganizationFormFields = {
  [ORGANIZATION_FIELDS.ADMIN_USERS]: [],
  [ORGANIZATION_FIELDS.AFFILIATED_ORGANIZATIONS]: [],
  [ORGANIZATION_FIELDS.CLASSIFICATION]: '',
  [ORGANIZATION_FIELDS.DATA_SOURCE]: '',
  [ORGANIZATION_FIELDS.DISSOLUTION_DATE]: null,
  [ORGANIZATION_FIELDS.FOUNDING_DATE]: null,
  [ORGANIZATION_FIELDS.ID]: '',
  [ORGANIZATION_FIELDS.INTERNAL_TYPE]: ORGANIZATION_INTERNAL_TYPE.NORMAL,
  [ORGANIZATION_FIELDS.NAME]: '',
  [ORGANIZATION_FIELDS.ORIGIN_ID]: '',
  [ORGANIZATION_FIELDS.PARENT_ORGANIZATION]: '',
  [ORGANIZATION_FIELDS.REGISTRATION_ADMIN_USERS]: [],
  [ORGANIZATION_FIELDS.REGULAR_USERS]: [],
  [ORGANIZATION_FIELDS.REPLACED_BY]: '',
  [ORGANIZATION_FIELDS.SUB_ORGANIZATIONS]: [],
};

export const AUTHENTICATION_NOT_NEEDED = [ORGANIZATION_ACTIONS.EDIT];

export const ORGANIZATION_SELECT_FIELDS = [
  ORGANIZATION_FIELDS.CLASSIFICATION,
  ORGANIZATION_FIELDS.PARENT_ORGANIZATION,
];
