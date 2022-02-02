import { EVENT_TYPE } from '../event/constants';
import {
  REGISTRATION_SEARCH_PARAMS,
  REGISTRATION_SORT_OPTIONS,
} from './constants';

export type RegistrationSearchParams = {
  [REGISTRATION_SEARCH_PARAMS.ENROLMENT_PAGE]?: number | null;
  [REGISTRATION_SEARCH_PARAMS.ENROLMENT_TEXT]?: string;
  [REGISTRATION_SEARCH_PARAMS.EVENT_TYPE]?: EVENT_TYPE[];
  [REGISTRATION_SEARCH_PARAMS.PAGE]?: number | null;
  [REGISTRATION_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [REGISTRATION_SEARCH_PARAMS.SORT]?: REGISTRATION_SORT_OPTIONS | null;
  [REGISTRATION_SEARCH_PARAMS.TEXT]?: string;
};

export type RegistrationSearchInitialValues = {
  [REGISTRATION_SEARCH_PARAMS.EVENT_TYPE]: EVENT_TYPE[];
  [REGISTRATION_SEARCH_PARAMS.PAGE]: number;
  [REGISTRATION_SEARCH_PARAMS.SORT]: REGISTRATION_SORT_OPTIONS;
  [REGISTRATION_SEARCH_PARAMS.TEXT]: string;
};

export type RegistrationSearchParam = keyof RegistrationSearchParams;

export type ReturnParams = {
  [REGISTRATION_SEARCH_PARAMS.RETURN_PATH]: string;
  remainingQueryString: string;
};

export type RegistrationsLocationState = {
  registrationId: string;
};
