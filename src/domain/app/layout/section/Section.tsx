import React from 'react';

import styles from './section.module.scss';

type Props = {
  title: string;
};

const Section: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Section;
