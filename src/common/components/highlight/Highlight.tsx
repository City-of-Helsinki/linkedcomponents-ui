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

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const Highlight: React.FC<HighlightProps> = ({
  className,
  headingLevel = 2,
  icon,
  text,
  title,
}) => {
  const titleParts = title.split('\n');
  const HeadingEl = HEADING_TAGS[headingLevel - 1] ?? 'h2';

  return (
    <section className={classNames(styles.highlight, className)}>
      <div className={styles.iconWrapper} aria-hidden={true}>
        {icon}
      </div>
      <HeadingEl className={styles.title} aria-label={titleParts.join(' ')}>
        {titleParts.map((part, index) => (
          <span key={`${part}-${index}`}>{part}</span>
        ))}
      </HeadingEl>
      <div className={styles.text}>{text}</div>
    </section>
  );
};

export default Highlight;
