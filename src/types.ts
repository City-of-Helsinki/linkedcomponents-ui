export type Language = 'en' | 'fi' | 'sv';

export type OptionType = {
  label: string;
  value: string;
};

export type Error<T> = {
  key: string;
} & T;
