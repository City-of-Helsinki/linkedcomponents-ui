import { OptionType } from '../../types';

export type PriceGroupOption = OptionType & { isFree: boolean };

export type PriceGroupFields = {
  description: string;
  id: string;
  isDefault: boolean;
  isFree: boolean;
  priceGroupUrl: string;
  publisher: string;
};
