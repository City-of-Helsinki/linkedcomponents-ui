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

const WaitingList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.waitingList}>
      <EnrolmentsTable
        caption={t('enrolmentsPage.waitingListTableCaption')}
        enrolmentsVariables={{ attendeeStatus: AttendeeStatus.Waitlisted }}
        heading={t('enrolmentsPage.waitingListTableHeading')}
        pagePath="waitingPage"
        registration={registration}
      />
    </div>
  );
};

export default WaitingList;
