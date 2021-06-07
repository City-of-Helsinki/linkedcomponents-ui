import { ErrorSummary } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ServerErrorItem } from '../../../types';
import styles from './serverErrorSummary.module.scss';

interface Props {
  errors: ServerErrorItem[];
}
const ServerErrorSummary: React.FC<Props> = ({ errors }) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (errors.length) {
      window.scrollTo(0, 0);
    }
  }, [errors]);
  if (!errors.length) return null;

  return (
    <ErrorSummary
      className={styles.serverErrorSummary}
      label={t('event.form.titleServerErrorSummary')}
      size="default"
    >
      <ul>
        {errors.map(({ label, message }, index) => (
          <li key={index}>
            <strong>{label}:</strong> {message}
          </li>
        ))}
      </ul>
    </ErrorSummary>
  );
};

export default ServerErrorSummary;
