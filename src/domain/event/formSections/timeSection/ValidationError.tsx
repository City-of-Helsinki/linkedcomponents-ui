import { ErrorMessage } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../constants';
import styles from './timeSection.module.scss';

const ValidationError: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <ErrorMessage key={locale} name={EVENT_FIELDS.EVENT_TIMES}>
      {(error) => (
        <div
          className={styles.errorText}
          id={`${EVENT_FIELDS.EVENT_TIMES}-error`}
          tabIndex={-1}
        >
          {t(error)}
        </div>
      )}
    </ErrorMessage>
  );
};

export default ValidationError;
