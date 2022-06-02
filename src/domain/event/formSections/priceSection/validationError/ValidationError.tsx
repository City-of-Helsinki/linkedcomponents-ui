import { ErrorMessage } from 'formik';
import React from 'react';

import ErrorText from '../../../../../common/components/errorText/ErrorText';
import useLocale from '../../../../../hooks/useLocale';
import { EVENT_FIELDS } from '../../../constants';

const ValidationError: React.FC = () => {
  const locale = useLocale();

  return (
    <ErrorMessage key={locale} name={EVENT_FIELDS.OFFERS}>
      {(error) => (
        <ErrorText id={`${EVENT_FIELDS.OFFERS}-error`} error={error} />
      )}
    </ErrorMessage>
  );
};

export default ValidationError;
