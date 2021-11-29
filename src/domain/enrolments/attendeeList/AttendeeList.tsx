import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import styles from '../enrolmentsPage.module.scss';
import EnrolmentsTable from '../enrolmentsTable/EnrolmentsTable';
import { getEnrolmentSearchInitialValues } from '../utils';

interface Props {
  registration: RegistrationFieldsFragment;
}

const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const { enrolmentText } = getEnrolmentSearchInitialValues(location.search);
  /* istanbul ignore next */
  const attendees = Array.isArray(registration.signups)
    ? (registration.signups as EnrolmentFieldsFragment[])
    : [];
  const filteredAttendees = attendees.filter((enrolment) =>
    enrolment.name?.toLowerCase().includes(enrolmentText.toLowerCase())
  );

  return (
    <div className={styles.attendeeList}>
      <EnrolmentsTable
        caption={t('enrolmentsPage.attendeeTableCaption')}
        enrolments={filteredAttendees}
        heading={t('enrolmentsPage.attendeeTableHeading')}
        registration={registration}
      />
    </div>
  );
};

export default AttendeeList;
