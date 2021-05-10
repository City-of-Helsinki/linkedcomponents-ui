import classNames from 'classnames';
import React from 'react';

import styles from './highlight.module.scss';

interface HighlightProps {
  className?: string;
  icon: React.ReactNode;
  text: string | React.ReactNode;
  title: string;
}

const Highlight: React.FC<HighlightProps> = ({
  className,
  icon,
  text,
  title,
}) => {
  return (
    <div className={classNames(styles.highlight, className)}>
      <div className={styles.iconWrapper} aria-hidden={true}>
        {icon}
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default Highlight;
