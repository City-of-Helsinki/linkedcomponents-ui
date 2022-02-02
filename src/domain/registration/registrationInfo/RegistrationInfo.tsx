import React from 'react';

import { DATETIME_FORMAT } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import useRegistrationName from '../hooks/useRegistrationName';
import { getRegistrationFields } from '../utils';
import CreatorBadge from './CreatorBadge';
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

      <p className={styles.editingInfo}>
        <span>{formatDate(lastModifiedAt, DATETIME_FORMAT)}</span>
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
