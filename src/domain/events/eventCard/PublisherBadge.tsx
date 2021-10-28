import React from 'react';

import styles from './publisherBadge.module.scss';

interface PublisherBadgeProps {
  name: string;
}

const PublisherBadge: React.FC<PublisherBadgeProps> = ({ name }) => {
  return <span className={styles.publisherBadge}>{name[0]}</span>;
};

export default PublisherBadge;
