import React from 'react';

import EditingInfo from '../../../common/components/editingInfo/EditingInfo';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useRegistrationName from '../hooks/useRegistrationName';
import { getRegistrationFields } from '../utils';
import styles from './registrationInfo.module.scss';

interface Props {
  registration: RegistrationFieldsFragment;
}

const RegistrationInfo: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const { createdBy, lastModifiedAt } = getRegistrationFields(
    registration,
    locale
  );

  const name = useRegistrationName({ registration });

  return (
    <div className={styles.registrationInfo}>
      <div className={styles.heading}>
        <h1>{name}</h1>
      </div>

      <EditingInfo createdBy={createdBy} lastModifiedAt={lastModifiedAt} />
    </div>
  );
};

export default RegistrationInfo;
