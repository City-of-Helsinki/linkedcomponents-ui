import React from 'react';

import styles from './eventInfo.module.scss';

interface CreatorBadgeProps {
  createdBy: string;
}

const CreatorBadge: React.FC<CreatorBadgeProps> = ({ createdBy }) => {
  return <span className={styles.creatorBadge}>{createdBy[0]}</span>;
};

export default CreatorBadge;
