import React from 'react';

import styles from './section.module.scss';

type Props = {
  title: string;
};

const Section: React.FC<Props> = ({ children, title }) => {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Section;
