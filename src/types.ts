import { Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

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

export type FCWithName = React.FC & { componentName: string };

export type StoreState = ReturnType<typeof rootReducer>;

export type StoreThunk = ThunkAction<void, StoreState, null, Action<string>>;
