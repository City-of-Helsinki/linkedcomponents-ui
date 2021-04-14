import { FieldProps, useField } from 'formik';
import { NumberInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../utils/validationUtils';
import NumberInput from '../numberInput/NumberInput';

type Props = FieldProps & NumberInputProps;

const NumberInputField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  ...rest
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
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
      onClick={() => {
        // TODO: Remove this when HDS NumberInput calls onChange
        // after clicking minus/plus button
        if (ref.current?.value !== value) {
          onChange({ target: { id: name, value: ref.current?.value } });
        }
      }}
    >
      <NumberInput
        {...rest}
        {...field}
        ref={ref}
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
