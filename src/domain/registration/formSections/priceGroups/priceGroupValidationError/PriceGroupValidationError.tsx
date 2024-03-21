import { ErrorMessage } from 'formik';
import React from 'react';

import ErrorText from '../../../../../common/components/errorText/ErrorText';
import useLocale from '../../../../../hooks/useLocale';
import { REGISTRATION_FIELDS } from '../../../constants';

const PriceGroupValidationError: React.FC = () => {
  const locale = useLocale();

  return (
    <ErrorMessage
      key={locale}
      name={REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}
    >
      {(error: string) => (
        <ErrorText
          id={`${REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}-error`}
          error={error}
        />
      )}
    </ErrorMessage>
  );
};

export default PriceGroupValidationError;
