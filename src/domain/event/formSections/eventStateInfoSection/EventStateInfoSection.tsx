import React from 'react';

import styles from './eventStateInfoSection.module.scss';

type EventStateInfoProps = {
  text?: string;
};

const EventStateInfoSection: React.FC<EventStateInfoProps> = ({ text }) => {
  return (
    <figure className={styles.infoWrapper}>
      <blockquote className={styles.infoBlock}>
        <p className={styles.infoText}>{text}</p>
      </blockquote>
    </figure>
  );
};

export default EventStateInfoSection;
