import React from 'react';

import { DATETIME_FORMAT } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import CreatorBadge from './creatorBadge/CreatorBadge';
import styles from './editingInfo.module.scss';

interface Props {
  createdBy: string;
  lastModifiedAt: Date | null;
}

const EditingInfo: React.FC<Props> = ({ createdBy, lastModifiedAt }) => {
  return (
    <p className={styles.editingInfo}>
      <span>{formatDate(lastModifiedAt, DATETIME_FORMAT)}</span>
      {createdBy && (
        <>
          <CreatorBadge createdBy={createdBy} />
          <span>{createdBy}</span>
        </>
      )}
    </p>
  );
};

export default EditingInfo;
