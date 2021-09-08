import React from 'react';

import { DATETIME_FORMAT } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import { getRegistrationFields } from '../../registrations/utils';
import CreatorBadge from './CreatorBadge';
import styles from './registrationInfo.module.scss';

interface Props {
  registration: Registration;
}

const RegistrationInfo: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const { createdBy, lastModifiedTime, name } = getRegistrationFields(
    registration,
    locale
  );

  return (
    <div className={styles.registrationInfo}>
      <div className={styles.heading}>
        <h1>{name}</h1>
      </div>

      <p className={styles.editingInfo}>
        <span>{formatDate(lastModifiedTime, DATETIME_FORMAT)}</span>
        {createdBy && (
          <>
            <CreatorBadge createdBy={createdBy} />
            <span>{createdBy}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default RegistrationInfo;
