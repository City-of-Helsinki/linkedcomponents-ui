import { API_CLIENT_ID } from './constants';

export type ApiTokenData = {
  apiToken: ApiTokenResponse | null;
  errors: object;
  loading: boolean;
};

export type ApiTokenResponse = {
  [API_CLIENT_ID]: string;
};
