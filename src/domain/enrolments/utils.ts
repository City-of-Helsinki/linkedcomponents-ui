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
import { EnrolmentFields, EnrolmentSearchInitialValues } from './types';

export const getEnrolmentSearchInitialValues = (
  search: string
): EnrolmentSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const attendeePage = searchParams.get(
    REGISTRATION_SEARCH_PARAMS.ATTENDEE_PAGE
  );
  const waitingPage = searchParams.get(REGISTRATION_SEARCH_PARAMS.WAITING_PAGE);
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.ENROLMENT_TEXT);

  return {
    attendeePage: Number(attendeePage) || 1,
    enrolmentText: getValue(text, ''),
    waitingPage: Number(waitingPage) || 1,
  };
};

export const getEnrolmentFields = ({
  enrolment,
  language,
  registration,
}: {
  enrolment: SignupFieldsFragment;
  language: Language;
  registration: RegistrationFieldsFragment;
}): EnrolmentFields => {
  const id = getValue(enrolment.id, '');
  /* istanbul ignore next */
  const registrationId = getValue(registration.id, '');
  const firstName = getValue(enrolment.firstName, '');
  const lastName = getValue(enrolment.lastName, '');
  const fullName = [firstName, lastName].filter(skipFalsyType).join(' ');

  return {
    id,
    attendeeStatus: enrolment.attendeeStatus as AttendeeStatus,
    email: getValue(enrolment.email, ''),
    enrolmentUrl: `/${language}${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registrationId
    ).replace(':enrolmentId', id)}`,
    firstName,
    fullName,
    lastName,
    phoneNumber: getValue(enrolment.phoneNumber, ''),
  };
};

export const getEnrolmentItemId = (id: string): string =>
  `enrolment-item-${id}`;

export const enrolmentsPathBuilder = ({
  args,
}: PathBuilderProps<SignupsQueryVariables>): string => {
  const { attendeeStatus, registration, text } = args;

  const variableToKeyItems = [
    { key: 'attendee_status', value: attendeeStatus },
    { key: 'registration', value: registration },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/signup/${query}`;
};
