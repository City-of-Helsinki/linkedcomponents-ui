import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './select.module.scss';

interface SelectLabelProps {
  nEvents: number;
  text: string;
}

const SelectLabel: React.FC<SelectLabelProps> = ({ nEvents, text }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={`${text} - ${t('common.eventAmount', { count: nEvents })}`}
      className={styles.label}
    >
      <div className={styles.text}>{text}</div>
      <div className={styles.amount}>
        ({t('common.eventAmount', { count: nEvents })})
      </div>
    </div>
  );
};

export default SelectLabel;
