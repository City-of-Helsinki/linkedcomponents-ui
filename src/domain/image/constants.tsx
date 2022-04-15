import { IconCogwheel, IconCrossCircle, IconPen, IconUpload } from 'hds-react';

export enum LICENSE_TYPES {
  CC_BY = 'cc_by',
  EVENT_ONLY = 'event_only',
}

export const DEFAULT_LICENSE_TYPE = LICENSE_TYPES.CC_BY;

export enum IMAGE_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
  UPLOAD = 'upload',
}

export const IMAGE_ACTION_ICONS = {
  [IMAGE_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [IMAGE_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [IMAGE_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [IMAGE_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
  [IMAGE_ACTIONS.UPLOAD]: <IconUpload aria-hidden={true} />,
};

export const IMAGE_ACTION_LABEL_KEYS = {
  [IMAGE_ACTIONS.CREATE]: 'common.save',
  [IMAGE_ACTIONS.DELETE]: 'image.form.buttonDelete',
  [IMAGE_ACTIONS.EDIT]: 'imagesPage.actionButtons.edit',
  [IMAGE_ACTIONS.UPDATE]: 'common.save',
  [IMAGE_ACTIONS.UPLOAD]: 'image.form.buttonUpload',
};

export const AUTHENTICATION_NOT_NEEDED = [IMAGE_ACTIONS.EDIT];

export const TEST_IMAGE_ID = 'image:1';
