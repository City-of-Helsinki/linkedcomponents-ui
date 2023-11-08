import React from 'react';

import EditingInfo from '../../../common/components/editingInfo/EditingInfo';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getRegistrationFields } from '../utils';
import styles from './registrationInfo.module.scss';

interface Props {
  registration: RegistrationFieldsFragment;
}

const RegistrationInfo: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const { createdBy, lastModifiedTime } = getRegistrationFields(
    registration,
    locale
  );

  const { event } = getRegistrationFields(registration, locale);

  return (
    <div className={styles.registrationInfo}>
      <div className={styles.heading}>
        <h1>{event?.name}</h1>
      </div>

      <EditingInfo createdBy={createdBy} lastModifiedTime={lastModifiedTime} />
    </div>
  );
};

export default RegistrationInfo;
