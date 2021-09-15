import React from 'react';
import { useTranslation } from 'react-i18next';

import { Registration } from '../../../generated/graphql';
import { waitingAttendeesResponse } from '../__mocks__/enrolmentsPage';
import styles from '../enrolmentsPage.module.scss';
import EnrolmentsTable from '../enrolmentsTable/EnrolmentsTable';

interface Props {
  registration: Registration;
}

const WaitingList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const attendees = waitingAttendeesResponse.enrolments.data;

  return (
    <div className={styles.waitingList}>
      <EnrolmentsTable
        caption={t('enrolmentsPage.waitingListTableCaption')}
        className={styles.table}
        enrolments={attendees}
        heading={t('enrolmentsPage.waitingListTableHeading')}
        registration={registration}
      />
    </div>
  );
};

export default WaitingList;
