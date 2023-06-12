import classNames from 'classnames';
import React from 'react';

import styles from './section.module.scss';

type Props = {
  className?: string;
  title: string;
};

const Section: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  title,
}) => {
  return (
    <div className={classNames(styles.section, className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Section;
