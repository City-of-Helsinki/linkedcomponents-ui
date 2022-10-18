import { PixelCrop } from 'react-image-crop';

import { MultiLanguageObject } from '../../types';
import { ADD_IMAGE_FIELDS, IMAGE_FIELDS } from './constants';

export type ImageFormFields = {
  [IMAGE_FIELDS.ALT_TEXT]: MultiLanguageObject;
  [IMAGE_FIELDS.ID]: string;
  [IMAGE_FIELDS.LICENSE]: string;
  [IMAGE_FIELDS.NAME]: string;
  [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: string;
  [IMAGE_FIELDS.PUBLISHER]: string;
  [IMAGE_FIELDS.URL]: string;
};

export type AddImageSettings = {
  [ADD_IMAGE_FIELDS.IMAGE_CROP]: PixelCrop | null;
  [ADD_IMAGE_FIELDS.IMAGE_FILE]: File | null;
  [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: string[];
  [ADD_IMAGE_FIELDS.URL]: string;
};
