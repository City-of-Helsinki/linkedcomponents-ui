import { FieldProps, useField } from 'formik';
import { TimeInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../../utils/validationUtils';
import TimeInput from '../../timeInput/TimeInput';

type Props = Omit<TimeInputProps, 'hoursLabel' | 'minutesLabel'> &
  FieldProps & { hoursLabel?: string; minutesLabel?: string };

const TimeInputField: React.FC<Props> = ({
  field: { name, onBlur, value, ...field },
  form,
  hoursLabel,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  return (
    <div onBlur={handleBlur}>
      <TimeInput
        {...rest}
        {...field}
        id={name}
        name={name}
        errorText={errorText}
        invalid={!!errorText}
        value={value}
        hoursLabel={hoursLabel || t('common.timeInput.hoursLabel')}
        minutesLabel={hoursLabel || t('common.timeInput.minutsLabel')}
      />
    </div>
  );
};

export default TimeInputField;
