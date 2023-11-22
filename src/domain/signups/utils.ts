import { ROUTES } from '../../constants';
import {
  AttendeeStatus,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupsQueryVariables,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
import { REGISTRATION_SEARCH_PARAMS } from '../registrations/constants';
import { SignupFields, SignupSearchInitialValues } from './types';

export const getSignupSearchInitialValues = (
  search: string
): SignupSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const attendeePage = searchParams.get(
    REGISTRATION_SEARCH_PARAMS.ATTENDEE_PAGE
  );
  const waitingPage = searchParams.get(REGISTRATION_SEARCH_PARAMS.WAITING_PAGE);
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.SIGNUP_TEXT);

  return {
    attendeePage: Number(attendeePage) || 1,
    signupText: getValue(text, ''),
    waitingPage: Number(waitingPage) || 1,
  };
};

export const getSignupFields = ({
  language,
  registration,
  signup,
}: {
  language: Language;
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
}): SignupFields => {
  const id = getValue(signup.id, '');
  const signupGroup = signup.signupGroup ?? null;
  /* istanbul ignore next */
  const registrationId = getValue(registration.id, '');
  const firstName = getValue(signup.firstName, '');
  const lastName = getValue(signup.lastName, '');
  const fullName = [firstName, lastName].filter(skipFalsyType).join(' ');

  return {
    id,
    attendeeStatus: signup.attendeeStatus as AttendeeStatus,
    email: getValue(signup.contactPerson?.email, ''),
    firstName,
    fullName,
    lastName,
    phoneNumber: getValue(signup.contactPerson?.phoneNumber, ''),
    signupGroup,
    signupGroupUrl: signupGroup
      ? `/${language}${ROUTES.EDIT_SIGNUP_GROUP.replace(
          ':registrationId',
          registrationId
        ).replace(':signupGroupId', signupGroup)}`
      : null,
    signupUrl: `/${language}${ROUTES.EDIT_SIGNUP.replace(
      ':registrationId',
      registrationId
    ).replace(':signupId', id)}`,
  };
};

export const getSignupItemId = (id: string): string => `signup-item-${id}`;

export const signupsPathBuilder = ({
  args,
}: PathBuilderProps<SignupsQueryVariables>): string => {
  const { attendeeStatus, page, pageSize, registration, text } = args;

  const variableToKeyItems = [
    { key: 'attendee_status', value: attendeeStatus },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'registration', value: registration },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/signup/${query}`;
};
