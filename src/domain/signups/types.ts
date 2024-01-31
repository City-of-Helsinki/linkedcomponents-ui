import { AttendeeStatus } from '../../generated/graphql';
import { REGISTRATION_SEARCH_PARAMS } from '../registrations/constants';

export type SignupSearchInitialValues = {
  [REGISTRATION_SEARCH_PARAMS.ATTENDEE_PAGE]: number;
  [REGISTRATION_SEARCH_PARAMS.SIGNUP_TEXT]: string;
  [REGISTRATION_SEARCH_PARAMS.WAITING_PAGE]: number;
};

export type SignupFields = {
  attendeeStatus: AttendeeStatus;
  contactPersonEmail: string;
  contactPersonPhoneNumber: string;
  firstName: string;
  fullName: string;
  lastName: string;
  id: string;
  phoneNumber: string;
  signupGroup: string | null;
  signupGroupUrl: string | null;
  signupUrl: string;
};

export type SignupsLocationState = {
  signupId: string | undefined;
};
