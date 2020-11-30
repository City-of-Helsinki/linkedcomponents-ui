import { API_CLIENT_ID } from './constants';
import reducers from './reducers';

export type TokenState = {
  apiToken: TokenResponse | null;
  errors: object;
  loading: boolean;
};

export type TokenResponse = {
  [API_CLIENT_ID]: string;
};

export type ReducerState = ReturnType<typeof reducers>;
