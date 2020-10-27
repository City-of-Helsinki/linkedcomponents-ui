import { StringLocale } from 'yup';

export type Language = 'en' | 'fi' | 'sv';

export type OptionType = {
  label: string;
  value: string;
};

export type StringError = {
  key: string;
} & StringLocale;
