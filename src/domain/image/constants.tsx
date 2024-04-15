import { IconCogwheel, IconCrossCircle, IconPen, IconUpload } from 'hds-react';
import React from 'react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import { AddImageSettings, ImageFormFields } from './types';

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

export enum IMAGE_FIELDS {
  ALT_TEXT = 'altText',
  ID = 'id',
  LICENSE = 'license',
  NAME = 'name',
  PHOTOGRAPHER_NAME = 'photographerName',
  PUBLISHER = 'publisher',
  URL = 'url',
}

export const IMAGE_INITIAL_VALUES: ImageFormFields = {
  [IMAGE_FIELDS.ALT_TEXT]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [IMAGE_FIELDS.ID]: '',
  [IMAGE_FIELDS.LICENSE]: LICENSE_TYPES.CC_BY,
  [IMAGE_FIELDS.NAME]: '',
  [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
  [IMAGE_FIELDS.PUBLISHER]: '',
  [IMAGE_FIELDS.URL]: '',
};

export enum ADD_IMAGE_FIELDS {
  IMAGE_CROP = 'imageCrop',
  IMAGE_FILE = 'imageFile',
  SELECTED_IMAGE = 'selectedImage',
  URL = 'url',
}

export const ADD_IMAGE_INITIAL_VALUES: AddImageSettings = {
  [ADD_IMAGE_FIELDS.IMAGE_CROP]: null,
  [ADD_IMAGE_FIELDS.IMAGE_FILE]: null,
  [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: [],
  [ADD_IMAGE_FIELDS.URL]: '',
};

export const IMAGE_SELECT_FIELDS = [IMAGE_FIELDS.PUBLISHER];

export const IMAGE_TEXT_FIELD_MAX_LENGTH = {
  [IMAGE_FIELDS.ALT_TEXT]: 320,
  [IMAGE_FIELDS.NAME]: 255,
  [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: 255,
};

export const IMAGE_TEXT_FIELD_MIN_LENGTH = {
  [IMAGE_FIELDS.ALT_TEXT]: 6,
};
