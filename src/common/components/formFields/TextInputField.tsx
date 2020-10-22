import { FieldProps } from 'formik';
import { TextInputProps } from 'hds-react/components/TextInput';
import React from 'react';

import TextInput from '../textInput/TextInput';

type Props = FieldProps & TextInputProps;

const TextInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  ...rest
}) => {
  return <TextInput {...rest} {...field} id={name} name={name} value={value} />;
};

export default TextInputField;
