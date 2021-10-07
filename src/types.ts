import { Action } from '@reduxjs/toolkit';
import React from 'react';
import { ThunkAction } from 'redux-thunk';

import { SEARCH_PARAMS } from './constants';
import rootReducer from './domain/app/store/reducers';

export type Language = 'en' | 'fi' | 'sv';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xlg';

export type OptionType = {
  label: string;
  value: string;
};

export type Error<T> = {
  key: string;
} & T;

export interface PathBuilderProps<T> {
  args: T;
}

export type FCWithName<P = Record<string, unknown>> = React.FC<P> & {
  componentName: string;
};

export type StoreState = ReturnType<typeof rootReducer>;

export type StoreThunk = ThunkAction<void, StoreState, null, Action<string>>;

export type LEServerError =
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
