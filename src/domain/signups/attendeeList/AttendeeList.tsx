import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  AttendeeStatus,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import styles from '../enrolmentsPage.module.scss';
import EnrolmentsTable from '../enrolmentsTable/EnrolmentsTable';

interface Props {
  registration: RegistrationFieldsFragment;
}

const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.attendeeList}>
      <EnrolmentsTable
        caption={t('enrolmentsPage.attendeeTableCaption')}
        enrolmentsVariables={{ attendeeStatus: AttendeeStatus.Attending }}
        heading={t('enrolmentsPage.attendeeTableHeading')}
        pagePath="attendeePage"
        registration={registration}
      />
    </div>
  );
};

export default AttendeeList;
