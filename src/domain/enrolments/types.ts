import { ENROLMENT_SEARCH_PARAMS } from './constants';

export type EnrolmentSearchParams = {
  [ENROLMENT_SEARCH_PARAMS.PAGE]?: number | null;
  [ENROLMENT_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [ENROLMENT_SEARCH_PARAMS.TEXT]: string;
};

export type EnrolmentSearchInitialValues = {
  [ENROLMENT_SEARCH_PARAMS.PAGE]: number;
  [ENROLMENT_SEARCH_PARAMS.TEXT]: string;
};

export type EnrolmentSearchParam = keyof EnrolmentSearchParams;

export type EnrolmentFields = {
  email: string;
  enrolmentUrl: string;
  id: string;
  name: string;
  phoneNumber: string;
};

export type EnrolmentsLocationState = {
  enrolmentId: string;
};
