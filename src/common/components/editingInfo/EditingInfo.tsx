import React from 'react';

import { DATETIME_FORMAT } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import CreatorBadge from './creatorBadge/CreatorBadge';
import styles from './editingInfo.module.scss';

interface Props {
  createdBy: string;
  lastModifiedTime: Date | null;
}

const EditingInfo: React.FC<Props> = ({ createdBy, lastModifiedTime }) => {
  return (
    <p className={styles.editingInfo}>
      <span>{formatDate(lastModifiedTime, DATETIME_FORMAT)}</span>
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
