import classNames from 'classnames';
import React from 'react';

import styles from './highlight.module.scss';

interface HighlightProps {
  className?: string;
  headingLevel?: number;
  icon: React.ReactNode;
  text: string | React.ReactNode;
  title: string;
}

const Highlight: React.FC<HighlightProps> = ({
  className,
  headingLevel = 2,
  icon,
  text,
  title,
}) => {
  const titleParts = title.split('\n');

  return (
    <section className={classNames(styles.highlight, className)}>
      <div className={styles.iconWrapper} aria-hidden={true}>
        {icon}
      </div>
      <div
        className={styles.title}
        role="heading"
        aria-level={headingLevel}
        aria-label={titleParts.join(' ')}
      >
        {titleParts.map((part, index) => (
          <span key={index}>{part}</span>
        ))}
      </div>
      <div className={styles.text}>{text}</div>
    </section>
  );
};

export default Highlight;
