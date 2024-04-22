import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  AttendeeStatus,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import styles from '../signupsPage.module.scss';
import SignupsTable from '../signupsTable/SignupsTable';

interface Props {
  registration: RegistrationFieldsFragment;
}

const WaitingList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.waitingList}>
      <SignupsTable
        caption={t('signupsPage.waitingListTableCaption')}
        countKey={'signupsPage.waitingListTableCount'}
        pagePath="waitingPage"
        registration={registration}
        signupsVariables={{ attendeeStatus: AttendeeStatus.Waitlisted }}
      />
    </div>
  );
};

export default WaitingList;
