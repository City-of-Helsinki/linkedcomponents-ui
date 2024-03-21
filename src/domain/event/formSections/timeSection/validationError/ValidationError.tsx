import { ErrorMessage } from 'formik';
import React from 'react';

import ErrorText from '../../../../../common/components/errorText/ErrorText';
import useLocale from '../../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../../constants';

const ValidationError: React.FC = () => {
  const locale = useLocale();

  return (
    <ErrorMessage key={locale} name={EVENT_FIELDS.EVENT_TIMES}>
      {(error: string) => (
        <ErrorText error={error} id={`${EVENT_FIELDS.EVENT_TIMES}-error`} />
      )}
    </ErrorMessage>
  );
};

export default ValidationError;
