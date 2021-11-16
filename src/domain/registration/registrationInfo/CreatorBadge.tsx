import React from 'react';

import styles from './registrationInfo.module.scss';

interface CreatorBadgeProps {
  createdBy: string;
}

const CreatorBadge: React.FC<CreatorBadgeProps> = ({ createdBy }) => {
  return <span className={styles.creatorBadge}>{createdBy.toString()[0]}</span>;
};

export default CreatorBadge;
