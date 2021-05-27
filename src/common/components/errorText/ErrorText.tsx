import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './errorText.module.scss';

interface ErrorTextProps {
  error: string;
  id: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ error, id }) => {
  const { t } = useTranslation();

  return typeof error === 'string' ? (
    <div className={styles.errorText} id={id} tabIndex={-1}>
      {t(error)}
    </div>
  ) : null;
};

export default ErrorText;
