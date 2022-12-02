import { FieldProps, useField } from 'formik';
import { NumberInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../../utils/validationUtils';
import NumberInput from '../../numberInput/NumberInput';

type Props = FieldProps & NumberInputProps;

const NumberInputField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  return (
    <div
      onBlur={() => {
        // TODO: Remove this when HDS NumberInput calls onBlur
        // even when minus/plus onBlur is called
        onBlur({ target: { id: name, value } });
      }}
    >
      <NumberInput
        {...rest}
        {...field}
        id={name}
        name={name}
        errorText={errorText}
        invalid={Boolean(errorText)}
        onBlur={() => undefined}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default NumberInputField;
