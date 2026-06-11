import { FieldProps, useField } from 'formik';
import { NumberInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import sanitizeElementId from '../../../../utils/sanitizeElementId';
import { getErrorText } from '../../../../utils/validationUtils';
import NumberInput from '../../numberInput/NumberInput';

type Props = FieldProps & NumberInputProps;

const NumberInputField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  ...rest
}) => {
  const { t } = useTranslation();
  const fieldId = sanitizeElementId(name);
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
        id={fieldId}
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
