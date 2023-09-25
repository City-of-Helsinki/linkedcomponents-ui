/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonVariant } from 'hds-react';
import { MouseEvent } from 'react';

import { MenuItemOptionProps } from './common/components/menuDropdown/types';
import { LE_DATA_LANGUAGES, SEARCH_PARAMS } from './constants';

export type Language = 'en' | 'fi' | 'sv';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xlg';

export type OptionType = {
  label: string;
  value: string;
};

export type TimeObject = { hours: number; minutes: number };

export type Error<T> = {
  key: string;
} & T;

export interface PathBuilderProps<T> {
  args: T;
}

export type LEServerError =
  | string
  | Record<string, unknown>
  | Array<Record<string, unknown> | string>;

export type ServerErrorItem = {
  label: string;
  message: string;
};

export type ReturnParams = {
  [SEARCH_PARAMS.RETURN_PATH]: string;
  remainingQueryString: string;
};

export type FilterType = 'date' | 'eventType' | 'place' | 'text';

export type FalsyType = false | null | undefined | '' | 0;

export type MultiLanguageObject = {
  [LE_DATA_LANGUAGES.AR]: string;
  [LE_DATA_LANGUAGES.EN]: string;
  [LE_DATA_LANGUAGES.FI]: string;
  [LE_DATA_LANGUAGES.RU]: string;
  [LE_DATA_LANGUAGES.SV]: string;
  [LE_DATA_LANGUAGES.ZH_HANS]: string;
};

export type Editability = {
  editable: boolean;
  warning: string;
};

export type ShowServerErrorsFnParams = {
  callbackFn?: () => void;
  error: any;
};

export type UseServerErrorsState = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (params: ShowServerErrorsFnParams) => void;
};

export type MutationCallbacks<ResponseDataType = string> = {
  onError?: (error: any) => Promise<void> | void;
  onSuccess?: (id?: ResponseDataType) => Promise<void>;
};

export type ButtonType = 'button' | 'reset' | 'submit' | undefined;

export type ActionButtonProps = {
  isSaving: boolean;
  type?: ButtonType;
  variant: Exclude<ButtonVariant, 'supplementary'>;
} & MenuItemOptionProps;

export type Maybe<T> = T | null | undefined;

export type CommonListProps = {
  onPageChange: (
    event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
  onSortChange: (sort: string) => void;
  pageCount: number;
  pageHref: (index: number) => string;
};
