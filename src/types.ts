/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonVariant, OptionInProps } from 'hds-react';
import { MouseEvent } from 'react';

import { MenuItemOptionProps } from './common/components/menuDropdown/types';
import {
  ADMIN_LIST_SEARCH_PARAMS,
  LE_DATA_LANGUAGES,
  SEARCH_PARAMS,
} from './constants';

export type Language = 'en' | 'fi' | 'sv';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xlg';

export type OptionType = OptionInProps;

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

export type FilterType =
  | 'date'
  | 'eventStatus'
  | 'eventType'
  | 'place'
  | 'publisher'
  | 'text';

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
  onSuccess?: (id?: ResponseDataType) => Promise<void> | void;
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

export type AdminListSearchParams = {
  [ADMIN_LIST_SEARCH_PARAMS.PAGE]?: number | null;
  [ADMIN_LIST_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [ADMIN_LIST_SEARCH_PARAMS.SORT]?: string | null;
  [ADMIN_LIST_SEARCH_PARAMS.TEXT]?: string;
};

export type AdminListSearchParam = keyof AdminListSearchParams;

export type AdminListSearchInitialValues<SortType> = {
  [ADMIN_LIST_SEARCH_PARAMS.PAGE]: number;
  [ADMIN_LIST_SEARCH_PARAMS.SORT]: SortType;
  [ADMIN_LIST_SEARCH_PARAMS.TEXT]: string;
};
