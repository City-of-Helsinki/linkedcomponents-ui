import { ErrorSummary } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { scroller } from 'react-scroll';

import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { ServerErrorItem } from '../../../types';
import getPageHeaderHeight from '../../../utils/getPageHeaderHeight';
import styles from './serverErrorSummary.module.scss';

interface Props {
  errors: ServerErrorItem[];
  id?: string;
}
const ServerErrorSummary: React.FC<Props> = ({ errors, id: _id }) => {
  const id = useIdWithPrefix({ id: _id, prefix: 'server-error-summary-' });
  const { t } = useTranslation();

  React.useEffect(() => {
    if (errors.length) {
      scroller.scrollTo(id, {
        delay: 0,
        duration: 500,
        offset: 0 - (getPageHeaderHeight() + 24),
        smooth: true,
      });
    }
  }, [errors, id]);

  if (!errors.length) return null;

  return (
    <div className={styles.serverErrorSummary} id={id}>
      <ErrorSummary
        className={styles.serverErrorSummary}
        label={t('event.form.titleServerErrorSummary')}
        size="default"
      >
        <ul>
          {errors.map(({ label, message }, index) => (
            <li key={`${label}:${message}:${index}`}>
              {label ? (
                <span>
                  <strong>{label}:</strong> {message}
                </span>
              ) : (
                message
              )}
            </li>
          ))}
        </ul>
      </ErrorSummary>
    </div>
  );
};

export default ServerErrorSummary;
