import { ErrorSummary } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { scroller } from 'react-scroll';

import { ServerErrorItem } from '../../../types';
import getPageHeaderHeight from '../../../utils/getPageHeaderHeight';
import styles from './serverErrorSummary.module.scss';

interface Props {
  errors: ServerErrorItem[];
  id?: string;
}
const ServerErrorSummary: React.FC<Props> = ({ errors, id: _id }) => {
  const [id] = React.useState(_id || uniqueId('server-error-summary-'));
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
            <li key={index}>
              <strong>{label}:</strong> {message}
            </li>
          ))}
        </ul>
      </ErrorSummary>
    </div>
  );
};

export default ServerErrorSummary;
