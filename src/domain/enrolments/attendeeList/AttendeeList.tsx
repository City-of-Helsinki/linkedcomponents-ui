import React from 'react';
import { useTranslation } from 'react-i18next';

import { Registration } from '../../../generated/graphql';
import { attendeesResponse } from '../__mocks__/enrolmentsPage';
import styles from '../enrolmentsPage.module.scss';
import EnrolmentsTable from '../enrolmentsTable/EnrolmentsTable';

interface Props {
  registration: Registration;
}

const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const attendees = attendeesResponse.enrolments.data;

  return (
    <div className={styles.attendeeList}>
      <EnrolmentsTable
        caption={t('enrolmentsPage.attendeeTableCaption')}
        enrolments={attendees}
        heading={t('enrolmentsPage.attendeeTableHeading')}
        registration={registration}
      />
    </div>
  );
};

export default AttendeeList;
