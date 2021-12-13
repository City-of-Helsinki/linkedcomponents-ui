import { AttendeeStatus } from '../../generated/graphql';
import { REGISTRATION_SEARCH_PARAMS } from '../registrations/constants';

export type EnrolmentSearchInitialValues = {
  [REGISTRATION_SEARCH_PARAMS.ENROLMENT_PAGE]: number;
  [REGISTRATION_SEARCH_PARAMS.ENROLMENT_TEXT]: string;
};

export type EnrolmentFields = {
  attendeeStatus: AttendeeStatus;
  email: string;
  enrolmentUrl: string;
  id: string;
  name: string;
  phoneNumber: string;
};

export type EnrolmentsLocationState = {
  enrolmentId: string;
};
