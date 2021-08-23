import React from 'react';

import styles from './textWithIcon.module.scss';

interface Props {
  icon: React.ReactNode;
  text: string | React.ReactNode;
}

const TextWithIcon: React.FC<Props> = ({ icon, text }) => {
  return (
    <div className={styles.textWithIcon}>
      {icon}
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default TextWithIcon;
