import React from 'react';

import styles from './organizationBadge.module.scss';

interface OrganizationBadgeProps {
  name: string;
}

const OrganizationBadge: React.FC<OrganizationBadgeProps> = ({ name }) => {
  return <span className={styles.organizationBadge}>{name[0]}</span>;
};

export default OrganizationBadge;
