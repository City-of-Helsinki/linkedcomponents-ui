import { MultiLanguageObject, OptionType } from '../../types';
import { PRICE_GROUP_FIELDS } from './constants';

export type PriceGroupOption = OptionType & { isFree: boolean };

export type PriceGroupFields = {
  description: string;
  id: string;
  isFree: boolean;
  priceGroupUrl: string;
  publisher: string;
};

export type PriceGroupFormFields = {
  [PRICE_GROUP_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [PRICE_GROUP_FIELDS.ID]: number | null;
  [PRICE_GROUP_FIELDS.IS_FREE]: boolean;
  [PRICE_GROUP_FIELDS.PUBLISHER]: string;
};
