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

const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.attendeeList}>
      <SignupsTable
        caption={t('signupsPage.attendeeTableCaption')}
        countKey={'signupsPage.attendeeTableCount'}
        enableAccessibilityNotifications={true}
        pagePath="attendeePage"
        registration={registration}
        signupsVariables={{ attendeeStatus: AttendeeStatus.Attending }}
      />
    </div>
  );
};

export default AttendeeList;
